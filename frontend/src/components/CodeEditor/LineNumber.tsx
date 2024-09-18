
const LineNumberedText = ({ color, text }) => {

  const generateLineNumberedText = (text) => {
    const lines = text.split('\n');

    const hasTrailingEmptyLine = lines[lines.length - 1] === '';

    if (hasTrailingEmptyLine && lines[lines.length - 2]?.endsWith('\n') === false) {
      lines.pop();
    }

    return lines.map((line, index) => ({
      lineNumber: index + 1,
      content: line
    }));
  };

  const lines = generateLineNumberedText(text);

  return (
    <div className="line-numbered-text">
      {lines.map(line => (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }} key={line.lineNumber}>
          {/* Line Numbers */}
          <div className="line-numbers">
            <div className="line-number">
              {line.lineNumber}
            </div>
          </div>

          <div className="text-content" style={{
          }}>
            <div className="line-content"
              style={{
                color: color.startsWith('red') ? '#F56565' : '#48BB78',
              }}>
              {line.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


export default LineNumberedText;
