import React from "react";
import { Box, Text } from '@chakra-ui/react';

const SubtitleScreen = () => {
  const [ subtitles, setSubtitles ] = React.useState("This is a subtitle");
  const [ fontSize, setFontSize ] = React.useState(15);
  return <Box bg="gray.200" minW="fit-content"><Text fontSize={fontSize}>{subtitles}</Text></Box> 
}

export default SubtitleScreen;