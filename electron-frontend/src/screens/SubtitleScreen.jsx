import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Box, Text, Button } from '@chakra-ui/react';
import { useGlobalState } from "electron-shared-state-react/dist/renderer/useGlobalState";

const SubtitleScreen = () => {
  const [ subtitles, setSubtitles ] = useState("tdsadog dasf asfaf dagag fdga s/397045 5/how-to-make- the-overflow- css-proper ty-work-w ith-hidden-as-value");
  const [transcript, setTranscript] = useGlobalState("transcript");
  const [sentences, setSentences] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const ref = useRef(null);

  useEffect(() => {
    window.electronAPI.setWindowSize(ref.current.offsetHeight+2, ref.current.offsetWidth+5)
  }, [transcript])

  useEffect(() => {
    if (transcript) {
      setSentences(transcript.split("."))
    }
    scrollToBottom()
  }, [transcript])

  return (
    <Box bg="gray.300" width="fit-content" height="100%" ref={ref} overflow="hidden" style={{ paddingBottom: "50px;" }}>
      {/* { transcript?  <Text fontSize={16} p={1}>{transcript}</Text> : <Box/>} */}
      { sentences && sentences.length > 0 && sentences.map(s => <Text fontSize={16} p={1}>{s}</Text>)}
      <div style={{ float:"left", clear: "both", marginTop: "100px" }} ref={messagesEndRef}>
      </div>
    </Box>
  )
}

export default SubtitleScreen;