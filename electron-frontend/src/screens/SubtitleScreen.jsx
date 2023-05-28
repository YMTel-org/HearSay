import { useState, useEffect } from "react";
import { Box, Text, Button } from '@chakra-ui/react';

const SubtitleScreen = () => {
  const [ subtitles, setSubtitles ] = useState("This is a subtitle");
  const [ fontSize, setFontSize ] = useState(20);

  function handleClick() {
    setSubtitles("changed!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  }

  return <Box bg="gray.200" minW="fit-content">
    <Text fontSize={fontSize}>{subtitles}</Text>
  </Box> 
}

export default SubtitleScreen;