import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Box, Text, Button } from '@chakra-ui/react';

const SubtitleScreen = () => {
  const [ subtitles, setSubtitles ] = useState("tdsadog dasf asfaf dagag fdga s/397045 5/how-to-make- the-overflow- css-proper ty-work-w ith-hidden-as-value");
  // useEffect(() => {
  //   // const electronWindow = componentRef.current;
  //   setSubtitles("test123");
  // }, []);
  const ref = useRef(null);

  useEffect(() => {
    window.electronAPI.setWindowSize(ref.current.offsetHeight+2, ref.current.offsetWidth+5)
  }, [subtitles])

  return (
    <Box bg="gray.300" width="fit-content" height="100%" ref={ref} overflow="hidden">
      { subtitles?  <Text fontSize={16} p={1}>{subtitles}</Text> : <Box/>}
    </Box>
  )
}

export default SubtitleScreen;