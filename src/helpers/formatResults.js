 function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 14;
    const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
  
    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;
  
    const results = [];
    results.push(
      `👍 ${upvotes.length} (${upPercentage.toFixed(1)}%) | 👎 ${
        downvotes.length
      } (${downPercentage.toFixed(1)}%)`
    );
  
    return results.join('');
 }

module.exports = formatResults;