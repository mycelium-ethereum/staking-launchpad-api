// this code is ported from https://github.com/etheralpha/validatorqueue-com/blob/main/build.py

export const estimateEntryWaitingTime = (
  beaconEntering: number,
  activeValidators: number,
): {
  entryWaitingTime: string;
  entryWaitingTimeSeconds: number;
} => {
  // const churnLimit = Math.max(4, Math.floor(activeValidators / 65536));
  const {
    formattedWaitTime: entryWaitingTime,
    waitingTimeSeconds: entryWaitingTimeSeconds,
  } = calculateWaitTime(activeValidators, beaconEntering);

  return {
    entryWaitingTime,
    entryWaitingTimeSeconds,
  };
};

export const estimateExitWaitingTime = (
  beaconExiting: number,
  activeValidators: number,
): {
  exitWaitingTime: string;
  exitWaitingTimeSeconds: number;
} => {
  // const churnLimit = Math.max(4, Math.floor(activeValidators / 65536));

  const {
    formattedWaitTime: exitWaitingTime,
    waitingTimeSeconds: exitWaitingTimeSeconds,
  } = calculateWaitTime(activeValidators, beaconExiting);

  return {
    exitWaitingTime,
    exitWaitingTimeSeconds,
  };
};

const calculateWaitTime = (
  activeValidators: any,
  queue: any,
): {
  formattedWaitTime: string;
  waitingTimeDaysRaw: number;
  currentChurn: number;
  aveChurn: number;
  churnTimeDays: number;
  waitingTimeSeconds: number;
} => {
  // different active validator levels and corresponding churn
  // prettier-ignore
  const scaling = [0,327680,393216,458752,524288,589824,    655360,720896,786432,851968,917504,983040,1048576,1114112,1179648,1245184,1310720,1376256,1441792,1507328,1572864,1638400,1703936,1769472,1835008,1900544,1966080,2031616,2097152,2162688,2228224,2293760,2359296,2424832,2490368,2555904,2621440,2686976,2752512]
  // prettier-ignore
  const epochChurn = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42]
  // prettier-ignore
  const dayChurn = [1000,1125,1350,1575,1800,2025,2250,2475,2700,2925,3150,3375,3600,3825,4050,4275,4500,4725,4950,5175,5400,5625,5850,6075,6300,6525,6750,6975,7200,7425,7650,7875,8100,8325,8550,8775,9000,9225,9450]

  let currentChurn = 9;
  let churnTimeDays = 0;
  let churnFactor = 0;

  scaling.forEach((item, i) => {
    if (activeValidators > scaling[i]) {
      currentChurn = epochChurn[i];
    }
    if (activeValidators >= scaling[i] && activeValidators < scaling[i + 1]) {
      let j = i;
      let queueRemaining = queue;
      while (queueRemaining > 0) {
        // different calcs for first run to account for starting in the middle of a level
        if (i === j) {
          // if the entire queue empties in the current level
          if (activeValidators + queueRemaining < scaling[j + 1]) {
            churnTimeDays += queueRemaining / dayChurn[j];
            churnFactor += queueRemaining * epochChurn[j];
            queueRemaining = 0;
          }
          // if the queue carries over into the next level
          else {
            churnTimeDays += (scaling[j + 1] - activeValidators) / dayChurn[j];
            churnFactor += (scaling[j + 1] - activeValidators) * epochChurn[j];
            queueRemaining -= scaling[j + 1] - activeValidators;
          }
        }
        // if the entire queue empties in the current level
        else if (scaling[j] + queueRemaining < scaling[j + 1]) {
          churnTimeDays += queueRemaining / dayChurn[j];
          churnFactor += queueRemaining * epochChurn[j];
          queueRemaining = 0;
        }
        // if the queue carries over into the next level
        else {
          churnTimeDays += (scaling[j + 1] - scaling[j]) / dayChurn[j];
          churnFactor += (scaling[j + 1] - scaling[j]) * epochChurn[j];
          queueRemaining -= scaling[j + 1] - scaling[j];
        }
        j += 1;
      }
    }
  });

  let aveChurn;
  if (queue > 0) {
    aveChurn = Math.round((churnFactor / queue) * 100) / 100;
  } else {
    aveChurn = currentChurn;
  }

  let waitingTimeSeconds = Math.round(churnTimeDays * 86400);

  // let waitingTimeMonths = Math.floor(waitingTimeSeconds / 2592000);
  // let waitingTimeMonthsDays = Math.round(
  // ((waitingTimeSeconds % 2592000) / 2592000) * 30
  // );

  let waitingTimeDays = Math.floor(waitingTimeSeconds / 86400);
  let waitingTimeDaysHours = Math.round(
    ((waitingTimeSeconds % 86400) / 86400) * 24,
  );

  let waitingTimeHours = Math.floor(waitingTimeSeconds / 3600);
  let waitingTimeHoursMinutes = Math.round(
    ((waitingTimeSeconds % 3600) / 3600) * 60,
  );

  let waitingTimeDaysRaw = waitingTimeSeconds / 86400;

  let formattedWaitTime, daysText, hoursText, minutesText;

  if (waitingTimeDays > 0) {
    daysText = 'days';
    hoursText = 'hours';
    if (waitingTimeDays === 1) {
      daysText = 'day';
    }
    if (waitingTimeDaysHours === 1) {
      hoursText = 'hour';
    }
    formattedWaitTime = `${waitingTimeDays} ${daysText}, ${waitingTimeDaysHours} ${hoursText}`;
  } else if (waitingTimeHours > 0) {
    hoursText = 'hours';
    minutesText = 'minutes';
    if (waitingTimeHours === 1) {
      hoursText = 'hour';
    }
    if (waitingTimeHoursMinutes === 1) {
      minutesText = 'minute';
    }
    formattedWaitTime = `${waitingTimeHours} ${hoursText}, ${waitingTimeHoursMinutes} ${minutesText}`;
  } else {
    minutesText = 'minutes';
    if (waitingTimeHoursMinutes === 1) {
      minutesText = 'minute';
    }
    formattedWaitTime = `${waitingTimeHoursMinutes} ${minutesText}`;
  }

  return {
    formattedWaitTime,
    waitingTimeDaysRaw,
    currentChurn,
    aveChurn,
    churnTimeDays,
    waitingTimeSeconds,
  };
};
