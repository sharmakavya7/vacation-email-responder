const generateConfig = (url, accessToken) => {
    return {
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-type": "application/json",
      },
    };
  };

const findOccurrenceInList = (list) => {
  const msgIdsToReply = {};
  list.forEach((obj) => {
    const {threadId} = obj;
    if(!msgIdsToReply.hasOwnProperty(threadId)) {
      msgIdsToReply[threadId] = 1;
    } else {
      msgIdsToReply[threadId]++;
    }
  });
  return msgIdsToReply;
};
  
module.exports = { 
  generateConfig,
  findOccurrenceInList
 };