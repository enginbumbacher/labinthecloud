define((require) => {
  const Module = require('core/app/module'),
    Utils = require('core/util/utils'),
    Globals = require('core/model/globals')
  ;

  return class EuglenaServerModule extends Module {
    constructor() {
      super();
      Utils.bindMethods(this, ['_onExperimentRequest', '_fakeResponse']);

      Globals.get('Relay').addEventListener('ExperimentServer.ExperimentRequest', this._onExperimentRequest);
    }

    _onExperimentRequest(evt) {
      window.setTimeout(this._fakeResponse, 500);
    }

    _fakeResponse() {
      Promise.all([
        Utils.promiseAjax('/cslib/module/euglena/demodata/lightdata_meta.json'),
        Utils.promiseAjax('/cslib/module/euglena/demodata/tracks.json')
      ]).then((metas) => {
        const results = {
          video: '/cslib/module/euglena/demodata/movie.mp4',
          runTime: metas[0].metaData.runTime / 1000,
          numFrames: metas[0].metaData.numFrames,
          fps: metas[0].metaData.numFrames / (metas[0].metaData.runTime / 1000),
          lights: [{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }],
          tracks: metas[1]
        };
        for (let track of results.tracks) {
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
              sample.angle += 180;
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
        for (let evt of metas[0].eventsToRun) {
          results.lights[results.lights.length - 1].duration = evt.askTime / 1000 - lastLight;
          lastLight = evt.askTime / 1000;
          results.lights.push({
            top: evt.topValue,
            left: evt.leftValue,
            bottom: evt.bottomValue,
            right: evt.rightValue
          });
        }
        results.lights[results.lights.length - 1].duration = results.runTime - lastLight;
        Globals.get('Relay').dispatchEvent('ExperimentServer.Results', results);
      });
    }
  }
})