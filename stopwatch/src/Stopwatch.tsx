import { useState, useEffect, useRef } from 'react';

function Stopwatch() {

  // State to track if the stopwatch is running
  const [isRunning, setIsRunning] = useState(false);

  // State to track total elapsed time in milliseconds
  const [elapsedTime, setElapsedTime] = useState(0);

  // Reference to store interval ID (to clear later)
  const intervalIdRef = useRef<number | null>(null);

  // State to store all lap times
  const [laps, setLaps] = useState<number[]>([]);

  // Reference to store when the stopwatch was started
  const startTimeRef = useRef(0);

  // useEffect runs when `isRunning` changes
  useEffect(() => {
    if (isRunning) {
      // Start updating elapsed time every 10ms
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);

      // Clean up interval when component unmounts or isRunning becomes false
      return () => {
        if (intervalIdRef.current !== null) {
          clearInterval(intervalIdRef.current);
        }
      };
    }
  }, [isRunning]);

  // Save current elapsed time to laps array
  function lap() {
    setLaps(prevLaps => [...prevLaps, elapsedTime]);
  }

  // Start or resume the stopwatch
  function start() {
    setIsRunning(true);
    // Adjust for pause by subtracting already elapsed time
    startTimeRef.current = Date.now() - elapsedTime;
  }

  // Pause the stopwatch
  function stop() {
    setIsRunning(false);
  }

  // Reset everything
  function reset() {
    setElapsedTime(0);
    setIsRunning(false);
    setLaps([]);
  }

  // Format the main timer display (HH:MM:SS:MS)
  function formatTime() {
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    const hoursStr = String(hours).padStart(2, "0");
    const minutesStr = String(minutes).padStart(2, "0");
    const secondsStr = String(seconds).padStart(2, "0");
    const millisecondsStr = String(milliseconds).padStart(2, "0");

    return `${hoursStr}:${minutesStr}:${secondsStr}:${millisecondsStr}`;
  }

  // Format lap time just like the main display
  function formatLapTime(time: number) {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    const milliseconds = Math.floor((time % 1000) / 10);

    const hoursStr = String(hours).padStart(2, "0");
    const minutesStr = String(minutes).padStart(2, "0");
    const secondsStr = String(seconds).padStart(2, "0");
    const millisecondsStr = String(milliseconds).padStart(2, "0");

    return `${hoursStr}:${minutesStr}:${secondsStr}:${millisecondsStr}`;
  }

  return (
    <div className='stopwatch'>
        {/* Main title */}
        <div className="stopwatch-title">
    <span role="img" aria-label="stopwatch">⏱️</span> Stopwatch
    </div>

      {/* Timer Display */}
      <div className='display'>{formatTime()}</div>

      {/* Buttons */}
      <div className='controls'>
        <button
          onClick={isRunning ? stop : start}
          className={isRunning ? 'pause-button' : 'start-button'}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button onClick={reset} className='reset-button'>Reset</button>
        <button onClick={lap} className='lap-button' disabled={!isRunning}>Lap</button>
      </div>

      {/* Show laps only if at least one exists */}
      {laps.length > 0 && (
        <div className='laps'>
          {laps.map((lapTime, index) => (
            <div key={index} className='lap'>
              Lap {index + 1}: {formatLapTime(lapTime)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Stopwatch;
