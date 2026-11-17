---
layout: post
title: Enable More Substitutions in FIFA 22 on Steam Deck
image: https://unsplash.com/photos/rOYAYXHgEh4/download?w=437
thumb: https://unsplash.com/photos/rOYAYXHgEh4/download?w=437
author: tushar sharma
category: blog
tags:
 - games
 - fifa 22
 - steam deck
---

I have played more than 150 hours of FIFA 22, mostly in Career Mode. I like building a large squad and giving more players time on the pitch, but the normal three-substitution limit makes that difficult. This patch changes the value used by my copy of the game so that I can make up to seven substitutions in a match.<!-- truncate_here -->

Although the original Cheat Engine option is named **Unlimited Substitutions (USER)**, the code behind it writes the value `7`. Therefore, “unlimited” in this post means that the usual limit is removed for practical purposes; this specific patch sets the limit to seven.

> **Important:** This patch is only verified for the exact `FIFA22.exe` whose SHA-256 hash appears below. Do not apply it to a different version. Modifying an executable can prevent the game from starting, and an update or file verification may overwrite the change. Use this only for offline play and keep the backup created by the script.

## What the patch changes

`FIFA22.exe` is not just one large piece of data. It contains thousands of small machine-code instructions that tell the computer what to do while the game is running. Those instructions are stored as bytes—numbers that are often written in hexadecimal form.

One instruction in my version of `FIFA22.exe` tells the computer to read the game's substitution limit from memory. The patch replaces only that instruction with a new one that says, in effect, **“use 7 as the substitution limit.”** Nothing else in the executable is intentionally changed.

Here is the change in simplified form:

```text
Before the patch: Read the substitution limit from the game's memory
After the patch:  Use 7 as the substitution limit
```

The script does not blindly search for any number `3` and replace it with `7`. That would be unsafe because the number `3` can appear in an executable for many unrelated reasons. Instead, it checks for one exact machine instruction at one exact location. It also verifies the hash of the entire executable first. These checks ensure that the file has exactly the same layout as the copy on which I tested the patch.

This is why you must not use the script with a different hash. Another FIFA 22 release may put this instruction somewhere else, or it may implement substitutions differently. Changing the same location in a different executable could modify unrelated code and prevent the game from running.

The rest of this section shows the exact machine-code change. You do not need to understand assembly language to follow the instructions later in the post.

I found the relevant instruction through the **Unlimited Substitutions (USER)** entry in [Aranaktu's FIFA 22 Career Mode Cheat Table](https://github.com/xAranaktu/FIFA-22-CM-Cheat-Table). Its `lua/consts.lua` file identifies this seven-byte pattern:

```text
8B 84 01 0C 9F 00 00
```

Those seven bytes represent this machine instruction:

```text
mov eax, [rcx+rax+0x9F0C]
```

In plain language, this instruction reads a value from memory and places it in a temporary CPU storage location called the `EAX` register. The game then uses the returned value as the substitution limit.

In my executable, this pattern occurs exactly once, at file offset `0x5AD8AA1`. A file offset is simply a numbered position inside the file. The instruction is immediately followed by a `ret`, which returns the value to the part of the game that requested it.

The patch replaces the seven-byte read with an instruction that puts `7` directly into `EAX`. The replacement instruction needs only five bytes, so two harmless `nop` (“do nothing”) instructions fill the remaining space. This keeps the replacement exactly seven bytes long, which means none of the code after it has to move.

```text
; Before: seven bytes at offset 0x5AD8AA1
mov eax, [rcx+rax+0x9F0C]
ret

; After: seven replacement bytes, followed by the existing ret
mov eax, 7
nop
nop
ret
```

At the byte level, the script makes this replacement:

```text
8B 84 01 0C 9F 00 00  ->  B8 07 00 00 00 90 90
```

## Before you begin

Switch the Steam Deck to **Desktop Mode**, close FIFA 22, and open Konsole. The game must remain closed while the script reads and replaces its executable.

You also need to know where your `FIFA22.exe` is stored. Mine is on the SD card at:

```text
/run/media/deck/SteamSD1/NonSteamGames/FIFA22/FIFA22.exe
```

If your file is elsewhere, replace that path in the first command below.

## Step 1: Select and verify the executable

Set `FIFA_EXE` to the full path of the executable, and then print its details and SHA-256 hash:

```bash
export FIFA_EXE='/run/media/deck/SteamSD1/NonSteamGames/FIFA22/FIFA22.exe'
ls -lh "$FIFA_EXE"
sha256sum "$FIFA_EXE"
```

Continue only if the hash is exactly:

```text
fddc0b5b4a093c460a5d0e07e117634366e2da0050f19eed3776c4340a56471a
```

If the hash differs, stop. Your executable is not the version for which this patch was verified. Do not change `expected_hash` in the script merely to bypass this check: a different build may store or use the value differently.

## Step 2: Apply the patch

Keep the same Konsole window open so that the `FIFA_EXE` variable is still set. Paste the entire command below and press Enter:

```bash
python3 - <<'PY'
from pathlib import Path
import hashlib
import os
import shutil
import tempfile

game = Path(os.environ['FIFA_EXE'])
backup = game.with_name(game.name + '.before-subs-patch')
expected_hash = 'fddc0b5b4a093c460a5d0e07e117634366e2da0050f19eed3776c4340a56471a'
offset = 0x5AD8AA1
original = bytes.fromhex('8B 84 01 0C 9F 00 00')
replacement = bytes.fromhex('B8 07 00 00 00 90 90')

def sha256(data):
    return hashlib.sha256(data).hexdigest()

data = game.read_bytes()

# Recognize an already-patched copy without applying the patch twice.
if data[offset:offset + 7] == replacement:
    reconstructed = data[:offset] + original + data[offset + 7:]
    if sha256(reconstructed) == expected_hash:
        raise SystemExit('Already patched: no changes made.')

if sha256(data) != expected_hash:
    raise SystemExit('STOP: executable does not match the verified original.')
if data.count(original) != 1:
    raise SystemExit('STOP: instruction pattern is not unique.')
if data[offset:offset + 8] != original + b'\xc3':
    raise SystemExit('STOP: expected instruction and return not found.')

# Exclusive creation preserves any existing backup.
with backup.open('xb') as f:
    f.write(data)
    f.flush()
    os.fsync(f.fileno())
shutil.copystat(game, backup)
if sha256(backup.read_bytes()) != expected_hash:
    raise SystemExit('STOP: backup verification failed; game unchanged.')

patched = data[:offset] + replacement + data[offset + 7:]
temp_path = None
try:
    with tempfile.NamedTemporaryFile(
        dir=game.parent, prefix=game.name + '.', suffix='.patching',
        delete=False
    ) as f:
        temp_path = Path(f.name)
        f.write(patched)
        f.flush()
        os.fsync(f.fileno())
    shutil.copystat(game, temp_path)
    if temp_path.read_bytes() != patched:
        raise SystemExit('STOP: temporary file verification failed.')
    if game.read_bytes() != data:
        raise SystemExit('STOP: executable changed during preparation.')
    os.replace(temp_path, game)
finally:
    if temp_path is not None and temp_path.exists():
        temp_path.unlink()

if game.read_bytes() != patched:
    raise SystemExit('STOP: final verification failed; restore the backup.')
print('Patch applied and verified.')
print('Backup:', backup)
print('Patched SHA-256:', sha256(patched))
PY
```

The script deliberately performs several checks before changing anything. It:

1. Confirms that the executable has the verified SHA-256 hash.
2. Confirms that the original byte pattern occurs exactly once at the expected offset.
3. Creates `FIFA22.exe.before-subs-patch` without overwriting an existing backup.
4. Verifies the backup.
5. Writes and verifies a temporary patched copy before atomically replacing `FIFA22.exe`.

A successful run ends with `Patch applied and verified.` and prints the backup path and the patched file's hash. If the script prints a message beginning with `STOP`, it has refused to patch an unexpected file. Resolve the stated problem instead of removing the safety check.

## Step 3: Test it

Start FIFA 22 and load an offline match in Career Mode. Make substitutions as usual and confirm that the game allows more than three, up to seven.

This executable patch differs from the original Cheat Engine workflow. The Cheat Engine table must be activated while a match is in progress because it changes the running process. The patch above changes the instruction in the executable itself, so there is nothing to activate during a match; the modified instruction is used when the game runs.

## Restore the original executable

Close FIFA 22 before restoring the backup. In the same Konsole session, first confirm that both files exist:

```bash
ls -lh "$FIFA_EXE" "$FIFA_EXE.before-subs-patch"
```

Then restore the original:

```bash
mv "$FIFA_EXE.before-subs-patch" "$FIFA_EXE"
```

Finally, verify that the restored executable has the original hash:

```bash
sha256sum "$FIFA_EXE"
```

It should again print `fddc0b5b4a093c460a5d0e07e117634366e2da0050f19eed3776c4340a56471a`.
