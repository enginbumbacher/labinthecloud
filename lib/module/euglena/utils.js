define((require) => {
  return {
    getLightState(lights, time) {
      let blockTime = 0;
      let light = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
      for (const block of lights) {
        if (time > blockTime && time <= blockTime + block.duration) {
          ['top', 'right', 'bottom', 'left'].forEach((key) => {
            light[key] = block[key];
          })
          break;
        }
        blockTime += block.duration;
      }
      return light;
    }
  }
})