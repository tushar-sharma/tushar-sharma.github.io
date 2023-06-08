---
published: false
---
Large Language model. It's based on transformer. It's a set of layers that helps it to understand to text. 

1. the model 
2. the tokenizer (split our text into shorter text).

Run a pipeline . it's a chain of inferences. Convert text into array of token. Then model use token and generate ? . 

Hugging face provides layer transformer. It's work with pytorch, etc. it's agnostic.

Optimum Intel. It has
1. neural compressor
2. openVINO

```
from openvino.runtime import Core
core = Core()

core.get_available_devices()

from pathlib import Path
from tansformers import AutoTokenizer
from optimum.intel.openvino import OVModelForCausalLM

model_id = "databricks/dolly-v2-3b"
model_path = Path("dolly-v2-3b")

tokenizer = AutoTokenizer.from_pretrained(model

```

Semi supervised learning , we decide what the output is 

AutoTokenizer: The AutoTokenizer class from the transformers library is used for tokenizing text. Tokenization is the process of splitting raw text into smaller units called tokens, which are typically individual words or subwords. Tokenization is a crucial step in natural language processing tasks, such as language modeling or text classificatio




[^ref1]: https://github.com/openvinotoolkit/openvino_notebooks
[^ref2]: https://huggingface.co/docs/transformers/index
[^ref3]: https://huggingface.co/docs/optimum/index
[^ref4]: https://huggingface.co/databricks/dolly-v2-3b
