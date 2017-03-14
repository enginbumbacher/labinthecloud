define((require) => {
  const Module = require('core/app/module'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals'),
    BPUConnector = require('./bpu_connector'),
    DemoConnector = require('./demo_connector'),
    LoadingScreen = require('./loadingscreen/loadingscreen')
  ;

  return class EuglenaServerModule extends Module {
    constructor() {
      super();

      Utils.bindMethods(this, [
        '_onExperimentRequest'
        , '_onExperimentUpdate'
        , '_onSubmissionError'
        , '_onQueueError'
        , '_onExperimentReady'
      ]);

      Globals.set('euglenaServerMode', 'bpu');
      this.bpu = new BPUConnector();
      this.bpu.addEventListener('BPUController.Error.Submission', this._onSubmissionError);
      this.bpu.addEventListener('BPUController.Error.Queue', this._onQueueError);
      this.bpu.addEventListener('BPUController.Experiment.Update', this._onExperimentUpdate);
      this.bpu.addEventListener('BPUController.Experiment.Ready', this._onExperimentReady);

      this.loadingScreen = new LoadingScreen();

      Globals.get('Relay').addEventListener('ExperimentServer.ExperimentRequest', this._onExperimentRequest);
    }

    init() {
      return new Promise((resolve, reject) => {
        this.bpu.addEventListener('BPUController.Ready', (evt) => {
          // console.log('Controller ready');
          resolve(true);
        })
        this.bpu.addEventListener('BPUController.Error.Connection', (evt) => {
          reject(evt.data.error);
        })
        this.bpu.addEventListener('BPUController.Error.ConnectionRefused', (evt) => {
          console.log(evt);
          this.demo = new DemoConnector();
          this.demo.addEventListener('DemoController.Experiment.Update', this._onExperimentUpdate);
          this.demo.addEventListener('DemoController.Experiment.Ready', this._onExperimentReady);
          this.demo.init();
          Globals.set('euglenaServerMode', 'demo');
          console.log('DEMO MODE');
          resolve(true);
        })
        this.bpu.init();
      })
    }

    run() {
      Globals.get('App.view').addChild(this.loadingScreen);
    }

    _onSubmissionError(evt) {
      console.log('Submission rejected:', evt.data.error)
    }
    _onQueueError(evt) {
      console.log('Queue request rejected:', evt.data.error)
    }
    _onExperimentUpdate(evt) {
      // console.log(evt.data);
      this.loadingScreen.update(evt.data);
    }
    _onExperimentReady(evt) {
      this.loadingScreen.hide();
      // console.log(evt.data);
      const report = evt.data.data.experiment;
      const tracks = evt.data.data.tracks;
      const results = {
        video: evt.data.data.video,
        runTime: (report.exp_runEndTime - report.exp_runStartTime) / 1000,
        numFrames: report.exp_metaData.numFrames,
        fps: report.exp_metaData.numFrames / ((report.exp_runEndTime - report.exp_runStartTime) / 1000),
        lights: [{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        }],
        tracks: tracks
      };
      for (let track of tracks) {
        track.startTime = track.startFrame / results.fps;
        track.lastTime = track.lastFrame / results.fps;
        let lastPos = null;
        for (let sample of track.samples) {
          sample.time = sample.frame / results.fps;
          sample.x = sample.rect[0];
          sample.y = sample.rect[1];
          sample.width = sample.rect[2];
          sample.height = sample.rect[3];
          sample.angle = sample.rect[4];
          if (sample.angle < 0) {
            sample.angle += 360;
          }

          if (lastPos) {
            let dTime = sample.time - lastPos.time;
            let dX = sample.x - lastPos.x;
            let dY = sample.y - lastPos.y;
            sample.speedX = dX / dTime;
            sample.speedY = dY / dTime;
            sample.speed = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)) / dTime;
            if (sample.speedX < 0) {
              sample.angle = (sample.angle + 180) % 360;
            }
          }
          lastPos = {
            x: sample.x,
            y: sample.y,
            time: sample.time
          }
        }
      }
      let lastLight = 0;
      for (let evtRan of report.exp_eventsRan) {
        // let t = (evtRan.setTime - report.exp_runStartTime) / 1000;
        let t = evtRan.setTime / 1000;
        if (t < 0) continue;
        results.lights[results.lights.length - 1].duration = t - lastLight;
        lastLight = t;
        results.lights.push({
          top: evtRan.topValue,
          left: evtRan.leftValue,
          bottom: evtRan.bottomValue,
          right: evtRan.rightValue
        });
      }
      results.lights[results.lights.length - 1].duration = results.runTime - lastLight;
      Globals.get('Relay').dispatchEvent('ExperimentServer.Results', results);
    }

    _onExperimentRequest(evt) {
      this.loadingScreen.reset();
      this.loadingScreen.show();
      const lightData = [];
      let timeAccumulated = 0
      evt.data.lights.forEach((ld) => {
        lightData.push({
          topValue: ld.top,
          rightValue: ld.right,
          bottomValue: ld.bottom,
          leftValue: ld.left,
          time: timeAccumulated
        });
        timeAccumulated += ld.duration * 1000
      })
      console.log(Globals.get('euglenaServerMode'))
      if (Globals.get('euglenaServerMode') == 'demo') {
        this.demo.runExperiment(lightData);
      } else {
        this.bpu.runExperiment(lightData);
      }
    }

  }
})