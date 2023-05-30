# MYTranslator

![image](https://github.com/YMTel-org/MYTranslator/assets/50147457/2c9cb32b-68e3-4b7c-959a-5286c6dc4d7c)


Overcoming physical and communication barriers. MyTranslator is an offline app that aims to help overcome language barriers with live subtitles, live translation, replying in any language via
text to speech and meeting minutes generation using quantized AI models such as whisper.cpp and a Llama based LLM model, Vicuna.

Everything being offline helps ensure that all information is kept private and will not be shared with anyone. Online options are also offered for users who prefer faster translation speeds.

To setup MYTranslator on your local device, follow thesse steps:

1. Git clone [MYTranslator](https://github.com/YMTel-org/MYTranslator) and [LocalAI](https://github.com/YMTel-org/LocalAI)

```
git clone https://github.com/YMTel-org/MYTranslator.git
git clone https://github.com/YMTel-org/LocalAI.git
```

2. In LocalAi, download the [LLM files](https://drive.google.com/file/d/1-GZFn1iHpu5JzUOivN3h372hspwTFdo-/view?usp=sharing) and the [Whisper files](https://drive.google.com/file/d/1rgbS0bPlXe7Aa__z__1TCK1KxMThh5vA/view?usp=sharing) into the `/models` directory
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


For Windows, navigate to Settings > Speech and download the following voice packages to your system.
![image](https://github.com/YMTel-org/MYTranslator/assets/50147457/f04cca57-6b06-4fb1-92d6-78c07bdb7751)


## Inspiration
Having worked at MNCs, we realised that language barriers could pose a significant hurdle for effective communication during business meetings. Language barriers can cause misunderstandings and result in unnecessary distress for workers who are not able to keep up with the discussion.

During our experiences working at MNCs, we also noticed that many professionals face – accurately capturing meeting minutes. Taking comprehensive and accurate notes during meetings can be a daunting task, especially when discussions involve multiple languages and diverse participants.

Inspired by meeting struggles, we envisioned an app to bridge this communication barrier across different languages and cultures. We wish to empower individuals, businesses, and organizations to communicate effortlessly, opening doors to new opportunities and fostering global understanding.

## What it does
MYTranslator harnesses the power of State-of-the-Art Large Language Models (LLMs) to revolutionize communication. With real-time translation capabilities, it enables seamless understanding by providing live translations and transcriptions during conversations. The text-to-speech feature ensures that users can communicate verbally, regardless of language barriers.

Moreover, our application offers the ability to generate meeting minutes, saving time and effort for participants. By leveraging the advanced capabilities of LLMs, it can summarize key points and important discussions, allowing users to quickly review and capture the essence of the meeting.

MYTranslator offers both online and offline modes. The offline capability provides users with peace of mind, knowing that their conversations and translations are not being transmitted or stored on external servers. This is particularly important for individuals and organizations that deal with confidential or sensitive information, such as business negotiations, legal discussions, or personal conversations.

However, we understand that some users may prioritize faster translation speeds and may be willing to trade off a certain level of privacy for the convenience of online translation services. To cater to these preferences, we also offer online options that leverage cloud-based services to provide faster translation capabilities.

## How we built it
ElectronJS: We chose ElectronJS as the framework to build a cross-platform desktop application. It allows us to use web technologies such as HTML, CSS, and JavaScript to create a native-like user interface.
React: We used React, a popular JavaScript library, to build the frontend components of our application. React provides a declarative and efficient way to create reusable UI elements.
Chakra UI: Chakra UI is a component library that offers a set of accessible and customizable UI components. We leveraged Chakra UI to design and style the user interface of our application.

LocalAI: We leveraged LocalAI to execute the AI models locally on the user's device. This approach ensures privacy and reduces the dependency on cloud-based services. By using quantised models, we can avoid the requirement of a  GPU altogether and making it accessible to more users.

Whisper.cpp: Whisper.cpp is a light-weight and high-performance inference of OpenAI's Whisper automatic speech recognition (ASR) model. and is an AI model specifically designed for speech recognition and transcription tasks. We integrated this model into our application to provide live transcriptions of spoken words during conversations.

Llama based LLM Model (Vicuna): We incorporated a Llama-based Large Language Model (LLM) called Vicuna. Vicuna is an open-source chatbot trained by fine-tuning LLaMA on user-shared conversations collected from ShareGPT. It is an auto-regressive language model, based on the transformer architecture. We chose to use a 7 Billion parameter, 4 bit quantized model to allow for good accuracy, while still having good speed and performance, being able to run on lower end firmwares. This LLM model enables real-time transla

