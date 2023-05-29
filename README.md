# MYTranslator

Overcoming physical and communication barriers

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
