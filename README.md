# HearSay

![image](https://github.com/YMTel-org/MYTranslator/assets/50147457/984ed78f-f8a1-4b18-929f-bb515fde6f80)
> HearSay - Live subtitles, live translation, text to speech and meeting minutes generation

![image_2023-05-30_11-47-50](https://github.com/YMTel-org/HearSay/assets/50147457/db500963-da86-4f4d-9295-2c88cd7bd421)
> Generated meeting minutes

![image_2023-05-30_11-41-21](https://github.com/YMTel-org/HearSay/assets/50147457/97290cdb-3008-4d0d-af9a-c75d864cd74c)
> Light/Dark Mode


Overcoming physical and communication barriers. HearSay is an offline app that aims to help overcome language barriers with live subtitles, live translation, replying in any language via
text to speech and meeting minutes generation using quantized AI models such as whisper.cpp and a Llama based LLM model, Vicuna.

Everything being offline helps ensure that all information is kept private and will not be shared with anyone. Online options are also offered for users who prefer faster translation speeds.

To setup HearSay on your local device, follow thesse steps:

1. Git clone [HearSay](https://github.com/YMTel-org/HearSay) and [LocalAI](https://github.com/YMTel-org/LocalAI)

```
git clone https://github.com/YMTel-org/HearSay.git
git clone https://github.com/YMTel-org/LocalAI.git
```

2. In LocalAi, download the [LLM files](https://drive.google.com/file/d/1-GZFn1iHpu5JzUOivN3h372hspwTFdo-/view?usp=sharing) and the [Whisper files](https://drive.google.com/file/d/1YvM9oGw9J94QzoDgOs23ABdlt2Drx7Wc/view?usp=sharing) into the `/models` directory
3. Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running, before entering the following command in the root directory of LocalAi:

```
docker-compose up -d --build
```

4. From the root directory of HearSay, navigage to `/electron-frontend` and run the electron client with:

```
cd electron-frontend/
yarn electron:start
```

Note: For online translation, you will need to generate your own Google Translate API key. Follow [this guide](https://support.cloudapplications.jp/faq/4329/?lang=en) to do so. Then, create a `.env` file in the root of HearSay with the following content:

```
REACT_APP_TRANSLATE_API_KEY={YOUR_KEY_HERE}
```

- For Windows, navigate to Settings > Speech and download the following voice packages to your system.
  ![image](https://github.com/YMTel-org/MYTranslator/assets/50147457/f04cca57-6b06-4fb1-92d6-78c07bdb7751)

- For Mac, navigate to System Preferences > Accessiblility > Spoken Content add the following voices Daniel, Kate and Li-Mu Siri, Ting-Ting
  ![image](https://github.com/YMTel-org/MYTranslator/assets/50147457/07fb538d-80a1-4dd9-b4b5-81d71bcb6083)

## Video

Watch our demo of the application [here](https://drive.google.com/file/d/1eMlMzr2xy9BWlxDyQw3rsB9DFSxqmdiY/view?usp=sharing).

## Inspiration
Having worked at MNCs, we realised that language barriers could pose a significant hurdle for effective communication during business meetings. Language barriers can cause misunderstandings and result in unnecessary distress for workers who are not able to keep up with the discussion.

During our experiences working at MNCs, we also noticed that many professionals face – accurately capturing meeting minutes. Taking comprehensive and accurate notes during meetings can be a daunting task, especially when discussions involve multiple languages and diverse participants.

Inspired by meeting struggles, we envisioned an app to bridge this communication barrier across different languages and cultures. We wish to empower individuals, businesses, and organizations to communicate effortlessly, opening doors to new opportunities and fostering global understanding.

## What it does
HearSay harnesses the power of State-of-the-Art Large Language Models (LLMs) to revolutionize communication. With real-time translation capabilities, it enables seamless understanding by providing live translations and transcriptions during conversations. The text-to-speech feature ensures that users can communicate verbally, regardless of language barriers.

Moreover, our application offers the ability to generate meeting minutes, saving time and effort for participants. By leveraging the advanced capabilities of LLMs, it can summarize key points and important discussions, allowing users to quickly review and capture the essence of the meeting.

HearSay offers both online and offline modes. The offline capability provides users with peace of mind, knowing that their conversations and translations are not being transmitted or stored on external servers. This is particularly important for individuals and organizations that deal with confidential or sensitive information, such as business negotiations, legal discussions, or personal conversations.

However, we understand that some users may prioritize faster translation speeds and may be willing to trade off a certain level of privacy for the convenience of online translation services. To cater to these preferences, we also offer online options that leverage cloud-based services to provide faster translation capabilities.

## How we built it
**ElectronJS**: We chose ElectronJS as the framework to build a cross-platform desktop application. It allows us to use web technologies such as HTML, CSS, and JavaScript to create a native-like user interface.

**React**: We used React, a popular JavaScript library, to build the frontend components of our application. React provides a declarative and efficient way to create reusable UI elements.

**Chakra UI**: Chakra UI is a component library that offers a set of accessible and customizable UI components. We leveraged Chakra UI to design and style the user interface of our application.

**LocalAI**: We leveraged LocalAI to execute the AI models locally on the user's device. This approach ensures privacy and reduces the dependency on cloud-based services. By using quantised models, we can avoid the requirement of a  GPU altogether and making it accessible to more users.

**Whisper.cpp**: Whisper.cpp is a light-weight and high-performance inference of OpenAI's Whisper automatic speech recognition (ASR) model. and is an AI model specifically designed for speech recognition and transcription tasks. We integrated this model into our application to provide live transcriptions of spoken words during conversations.

**Llama based LLM Model (Vicuna)**: We incorporated a Llama-based Large Language Model (LLM) called Vicuna. Vicuna is an open-source chatbot trained by fine-tuning LLaMA on user-shared conversations collected from ShareGPT. It is an auto-regressive language model, based on the transformer architecture. We chose to use a 7 Billion parameter, 4 bit quantized model to allow for good accuracy, while still having good speed and performance, being able to run on lower end firmwares. This LLM model enables real-time translation of text, allowing users to communicate across different languages seamlessly.
                  
By combining the power of ElectronJS, React, and Chakra UI, we created a user-friendly and responsive frontend interface. The integration of the Whisper.cpp and Vicuna AI models, along with the use of LocalAI, enabled us to deliver real-time transcription, translation, and text-to-speech features within the application.

## Challenges we ran into
During the development process, we encountered several challenges that tested our problem-solving skills and pushed us to find innovative solutions. Here are the key challenges we faced:

**Learning Electron**: Electron was a new technology for our team, and there was a learning curve associated with understanding its architecture and how to develop applications using it. We took a while to pick up Electron's concepts, API, and best practices to ensure smooth development. Since we tried integrating Electron with React, we had to figure out how to expose functions to allow React to communicate with Electron.

**Integration of AI Models**: Integrating the Whisper.cpp speech recognition model and the Llama-based LLM model, Vicuna, presented its own set of challenges. Initially, the model results were not as accurate as we expected, and we explored many different variations before deciding on our current implementation.

Despite these challenges, we remained persistent and collaborative, leveraging online resources, documentation, and the support of the developer community to overcome obstacles. Through continuous learning, iteration, and optimization, we were able to build a functional and reliable application that fulfilled our vision of enabling seamless communication across languages.

## Accomplishments that we're proud of
Throughout the development of our application, we have achieved several accomplishments that we are proud of. These accomplishments showcase our dedication, creativity, and commitment to delivering a high-quality product. Here are some of our notable accomplishments:

**Seamless Integration of AI Models**: Successfully integrating the Whisper.cpp speech recognition model and the Llama-based LLM model, Vicuna, into our application was a significant accomplishment. We overcame challenges in model optimization and fine-tuning to ensure accurate transcriptions and translations in real time.

**Cross-Platform Compatibility**: Our application is built using ElectronJS, enabling us to deliver a cross-platform solution. We are proud to have developed an application that functions seamlessly on multiple operating systems, including Windows, macOS, and Linux, providing accessibility to a wide range of users.

**Responsive and Intuitive User Interface**: We dedicated time and effort to designing a user interface that is both visually appealing and user-friendly. Our accomplishment lies in creating an interface that effectively presents real-time transcriptions, translations, and other features, allowing users to navigate and interact with ease.

**LocalAI Integration for Privacy**: Incorporating LocalAI into our application was an important accomplishment. By executing the AI models locally on the user's device, we prioritize user privacy and eliminate the need for reliance on cloud-based services.

**Optimized Performance**: We are proud of the performance optimization achieved in our application. By fine-tuning parameters, reducing latency, and improving responsiveness, we have created an application that delivers fast and efficient real-time transcription, translation, and text-to-speech functionality.

**Meeting Minutes Generation**: A notable accomplishment is the implementation of meeting minutes generation using our AI models. By leveraging the power of natural language processing, we enable the automatic summarization of key points and important discussions, saving time and effort for meeting participants.

## What we learned
Throughout the development process of our application, we have gained valuable insights and learnings that have contributed to our growth as a team and as individuals. Here are some of the key lessons we have learned:

**Familiarity with Electron**: We have learned the intricacies of working with Electron, a powerful framework for building desktop applications. We gained a deep understanding of Electron's architecture, features, and development workflow, which will enable us to tackle future Electron-based projects more efficiently.

**Integration of AI Models**: Integrating AI models into our application taught us the importance of thorough research, experimentation, and optimization. We learned how to make use of different LLMs to achieve better accuracy and performance. We also gained insights into handling real-time data processing and managing resources effectively.

**Collaboration and Communication**: Building a complex application like ours required strong collaboration and effective communication within our team. We learned the significance of clear and concise communication, regular team meetings, and sharing progress updates. Collaborating on code repositories and managing version control improved our teamwork skills.


## What's next for [YHApple] MYTranslator
**Enhanced Language Support**: We aim to expand the language support of our application, enabling users to communicate in a broader range of languages. This will involve integrating additional language models and improving the accuracy and performance of existing language translations.

**Integration with External Services**: We plan to integrate our application with external services and platforms to offer additional functionality. This could include integration with popular communication tools, such as video conferencing platforms, to provide seamless live transcription and translation during meetings.

**User Interface Enhancements**: We will continue to iterate and enhance the user interface of our application based on user feedback and industry best practices. This will involve refining the design, improving usability, and implementing new features to create a visually appealing and intuitive user experience.

**Performance Optimization**: We will focus on further optimizing the performance of our application, including reducing latency, improving response times, and minimizing resource usage. This will ensure a smooth and efficient user experience, even on devices with limited processing power.
