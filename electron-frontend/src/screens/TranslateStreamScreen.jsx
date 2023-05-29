import React from "react";
import { useEffect, useState } from "react";

const tds = {
  start() {
    this.decoder = new TextDecoder(this.encoding, this.options);
  },
  transform(chunk, controller) {
    controller.enqueue(this.decoder.decode(chunk));
  },
};
let _jstds_wm = new WeakMap(); /* info holder */
class TextDecoderStream extends TransformStream {
  constructor(encoding = "utf-8", { ...options } = {}) {
    let t = { ...tds, encoding, options };

    super(t);
    _jstds_wm.set(this, t);
  }
  get encoding() {
    return _jstds_wm.get(this).decoder.encoding;
  }
  get fatal() {
    return _jstds_wm.get(this).decoder.fatal;
  }
  get ignoreBOM() {
    return _jstds_wm.get(this).decoder.ignoreBOM;
  }
}

const SubtitleScreen = () => {
  const [input, setInput] = useState("");
  const [translation, setTranslation] = useState("");

  const streamReply = async (prompt) => {
    setTranslation("Loading... Please Wait...");
    const response = await fetch("http://localhost:8080/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "vicuna",
        messages: [
          {
            role: "user",
            content:
              "Context: This an interview. Translate the following into Chinese:" +
              prompt,
          },
        ],
        stream: true,
      }),
    });
    if (!response.body) return;
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();
    let reply = "";
    while (true) {
      var { value, done } = await reader.read();
      if (value) {
        if (value.includes("[DONE]")) break;
        const parsed = JSON.parse(value.slice(6));
        console.log(parsed.choices[0].delta.content);
        if (parsed.choices[0].delta.content) {
          reply += parsed.choices[0].delta.content;
          setTranslation(reply);
        }
      }

      if (done) {
        console.log("Done!");
        break;
      }
      // console.log(event.data);
    }
  };
  return (
    <div>
      Translation
      <br />
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => streamReply(input)}>Click Me</button>
      <br />
      <h1>{translation}</h1>
    </div>
  );
};

export default SubtitleScreen;
