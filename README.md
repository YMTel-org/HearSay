# MYTranslator

Overcoming physical and communication barriers. MyTranslator is an offline app that aims to help overcome language barriers with live subtitles, live translation, replying in any language via
text to speech and meeting minutes generation using quantized AI models such as whisper.cpp and a Llama based LLM model, Vicuna.

Everything being offline helps ensure that all information is kept private and will not be shared with anyone. Online options are also offered for users who prefer faster translation speeds.

To setup MYTranslator on your local device, follow thesse steps:

1. Git clone [MYTranslator](https://github.com/YMTel-org/MYTranslator) and [LocalAI](https://github.com/YMTel-org/LocalAI)

```
git clone https://github.com/YMTel-org/MYTranslator.git
git clone https://github.com/YMTel-org/LocalAI.git
```

2. In LocalAi, download the [LLM files](https://drive.google.com/file/d/1-GZFn1iHpu5JzUOivN3h372hspwTFdo-/view?usp=sharing) and the [Whisper files]() into the `/models` directory
3. Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running, before entering the following command in the root directory of LocalAi:

```
docker-compose up -d --build
```

4. From the root directory of MYTranslator, navigage to `/electron-frontend` and run the electron client with:

```
cd electron-frontend/
yarn electron:start
```

Note: For online translation, you will need to generate your own Google Translate API key. Follow [this guide](https://support.cloudapplications.jp/faq/4329/?lang=en) to do so. Then, create a `.env` file in the root of MYTranslator with the following content:

```
REACT_APP_TRANSLATE_API_KEY={YOUR_KEY_HERE}
```
