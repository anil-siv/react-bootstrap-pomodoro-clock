//grab time left from state and spit it out into HH:MM format, adding 0 in H or M < 10

const ClockifyTimeLeft = (props) => {
  let minutes = Math.floor(props.timeLeft / 60);
  let seconds = props.timeLeft - minutes * 60;

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return (
    <p id='time-left'>
      {minutes}:{seconds}
    </p>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: 1500,
      seshTime: 1500,
      breakTime: 300,
      isRunning: false,
      sessionOrBreak: "Session",
      intervalId: null,
    };
    this.seshLengthUp = this.seshLengthUp.bind(this);
    this.seshLengthDown = this.seshLengthDown.bind(this);
    this.breakLengthUp = this.breakLengthUp.bind(this);
    this.breakLengthDown = this.breakLengthDown.bind(this);
    this.sessionCountdown = this.sessionCountdown.bind(this);
    this.breakCountdown = this.breakCountdown.bind(this);
    this.reset = this.reset.bind(this);
    this.tick = this.tick.bind(this);
  }

//timer function that runs every second, decrementing state until 00:00 when it fires off to either start a new 25 or new 5
  tick() {
    let beep = document.getElementById("beep");
    if (this.state.timeLeft > 0) {
      this.setState({
        timeLeft: this.state.timeLeft - 1,
      });
    } else if (this.state.timeLeft == 0) {
      if (this.state.sessionOrBreak == "Session") {
        clearInterval(this.state.intervalId);
        beep.play();
        this.breakCountdown();
      } else {
        this.setState({
          timeLeft: this.state.seshTime,
          sessionOrBreak: "Session",
        });
        clearInterval(this.state.intervalId);
        beep.play();
        this.sessionCountdown();
      }
    }
  }

// functions to increment or decrement session time and break time
  seshLengthUp() {
    if (this.state.seshTime < 3600) {
      this.setState({
        seshTime: this.state.seshTime + 60,
        timeLeft: this.state.seshTime + 60,
      });
    }
  }

  seshLengthDown() {
    if (this.state.seshTime > 60) {
      this.setState({
        seshTime: this.state.seshTime - 60,
        timeLeft: this.state.seshTime - 60,
      });
    }
  }
  breakLengthUp() {
    if (this.state.breakTime < 3600) {
      this.setState({
        breakTime: this.state.breakTime + 60,
      });
    }
  }
  breakLengthDown() {
    if (this.state.breakTime > 60) {
      this.setState({
        breakTime: this.state.breakTime - 60,
      });
    }
  }

  sessionCountdown() {
    if (!this.state.isRunning) {
      let intervalId = setInterval(this.tick, 1000);
      this.setState({
        isRunning: true,
        seshTime: this.state.seshTime,
        timeLeft: this.state.timeLeft,
        sessionOrBreak: "Session",
        intervalId: intervalId,
      });
    } else {
      clearInterval(this.state.intervalId);
      this.setState({ isRunning: false });
    }
  }

    breakCountdown() {
    this.setState({
      isRunning: true,
      timeLeft: this.state.breakTime,
      sessionOrBreak: "Break",
    });
    let intervalId = setInterval(this.tick, 1000);
    this.setState({
      intervalId: intervalId,
    });
  }
  
  
  reset() {
    clearInterval(this.state.intervalId);
    let beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
    this.setState({
      timeLeft: 1500,
      seshTime: 1500,
      breakTime: 300,
      isRunning: false,
      sessionOrBreak: "Session",
    });
  }

  render() {
    return (
      <div
        className='container-fluid bg-info'
        style={{ height: "125vh", textAlign: "center" }}>
        <div
          className='card bg-info'
          style={{
            width: 500,
            maxWidth: "90vw",
            margin: "0 auto",
            position: "relative",
            top: "15vh",
            textAlign: "center",
            maxHeight: "90vh"
          }}>
          <div className='card-header text-white'>
            <h2>Pomodoro Clock</h2>
          </div>
          <div className='text-white' id='clock' style={{ padding: "10px" }}>
            <h3 id='timer-label'>{this.state.sessionOrBreak}</h3>
            <ClockifyTimeLeft timeLeft={this.state.timeLeft} />
          </div>
          <div
            id='buttons'
            className='text-white'
            style={{ display: "inline" }}>
            <button
              id='start_stop'
              onClick={this.sessionCountdown}
              className='btn btn-info'>
              <i
                className='fa fa-hourglass-start fa-3x'
                style={{ marginLeft: "30px", marginRight: "30px" }}></i>
            </button>
            <button id='reset' onClick={this.reset} className='btn btn-info'>
              <i
                className='fa fa-undo fa-3x'
                style={{ marginLeft: "30px", marginRight: "30px" }}></i>
            </button>
          </div>
          <div id='setters' style={{ display: "inline", padding: "30px" }}>
            <div
              className='text-white'
              id='break-setter'
              style={{ display: "inline-block", padding: "10px" }}>
              <h4 id='session-label'>Session Length</h4>
              <p id='session-length'>{this.state.seshTime / 60}</p>
              <button
                id='session-increment'
                onClick={this.seshLengthUp}
                className='btn btn-info'>
               
                <i className='fa fa-arrow-up fa-lg'></i>
              </button>
              <button
                id='session-decrement'
                onClick={this.seshLengthDown}
                className='btn btn-info'>
                <i className='fa fa-arrow-down fa-lg'></i>
              </button>
            </div>
            <div
              className='text-white'
              id='break-setter'
              style={{ display: "inline-block", padding: "10px" }}>
              <h4 id='break-label'>Break Length</h4>
              <p id='break-length'>{this.state.breakTime / 60}</p>
              <button
                id='break-increment'
                onClick={this.breakLengthUp}
                className='btn btn-info'>
                
                <i className='fa fa-arrow-up fa-lg'></i>
              </button>
              <button
                id='break-decrement'
                onClick={this.breakLengthDown}
                className='btn btn-info'>
                
                <i className='fa fa-arrow-down fa-lg'></i>
              </button>
            </div>
          </div>
        </div>
        <div>
          <audio
            id='beep'
            src='https://arcarc.xmission.com/Arcade%20by%20Title/Pac-Man/pacman%20dead.wav'
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
