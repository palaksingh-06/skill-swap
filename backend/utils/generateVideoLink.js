const generateVideoLink = () => {
  const roomId = "skillswap-" + Math.random().toString(36).substring(2, 10);
  return `https://meet.jit.si/${roomId}`;
};

module.exports = generateVideoLink;
