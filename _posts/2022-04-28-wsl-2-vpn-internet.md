---
published: false
---
On windows , open powershell in administrator mode (or run elevated right) 

Get nameserver

```bash
> Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object -ExpandProperty ServerAddresses
```

Get search domain 

```
Get-DnsClientGlobalSetting | Select-Object -ExpandProperty SuffixSearchList
```

On Wsl2 long, modifty the /etc/resolv.conf and paste those nameserver

```bash
$ sudo rm /etc/resolv.conf
$ vim /etc/resolv.conf
nameserver 8.8.8.8
nameserver 1.1.1.1
# paste the remaning here from powershell
search $Search_domain_here

```
Make sure there's no namerserver that starts with 172.* or 192.


Make the new /etc/resolve.conf immutable
 ```
sudo chattr +i /etc/resolv.conf 
```

Restart wsl on powershell.

```bash
> Restart-Service LxssManager
```