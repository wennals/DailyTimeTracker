'use client';

import { useEffect, useState } from 'react';
import { PersonelData } from '../models/personel-data';
import { EmployeeStatus, statusColorMap } from '../models/status';
import { getElapsedTime } from '../utils/getElapsedTime';

export function EmployeeStatusListItem({
  personelData,
  currentTime,
  isStopped,
  stopTimer,
}: {
  personelData: PersonelData;
  currentTime: Date;
  isStopped: boolean;
  stopTimer: Function;
}) {
  const inTime: Date = personelData.J;
  const outTime: Date | undefined = personelData.L;

  const [timeElapsed, setTimeElapsed] = useState<string>();
  const [status, setStatus] = useState<EmployeeStatus | undefined>();

  useEffect(() => {
    const { duration, elapsedTimeString } = getElapsedTime(
      personelData.J,

      currentTime
    );
    const hours = duration.hours ?? 0;

    if (hours < 8) {
      setStatus(EmployeeStatus.GOOD);
    } else if (hours >= 8 && hours <= 11) {
      setStatus(EmployeeStatus.WARNING);
    } else if (hours > 11) {
      setStatus(EmployeeStatus.RISK);
    }
    setTimeElapsed(elapsedTimeString);
  }, [currentTime, personelData.J]);

  return (
    <>
      <li
        className={`flex justify-between gap-x-6 py-5 px-2 ${
          isStopped ? 'bg-gray-100' : ''
        }`}
      >
        <div className="flex min-w-0 gap-x-4">
          <div className="mt-1 flex items-center gap-x-6">
            <div
              className={`flex-none rounded-full ${
                status != null ? statusColorMap[status].light : ''
              } p-1`}
            >
              <div
                className={`h-6 w-6 rounded-full  ${
                  status != null ? statusColorMap[status].dark : ''
                }
                `}
              ></div>
            </div>
          </div>
          <div className="min-w-0 flex-auto">
            <p className="text-sm font-semibold leading-6 text-gray-900">
              {personelData.A}
            </p>
            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
              {timeElapsed}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 gap-x-4 self-center">
          <p className="text-sm leading-6 text-gray-900">
            Time-in:{' '}
            <time className="font-bold">
              {inTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
            </time>
          </p>
        </div>
        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded disabled:bg-gray-500 disabled:border-gray-700"
            onClick={() => {
              const clockOut = confirm(
                `Are you sure you want to clock ${personelData.A} out?\n This will stop the current timer`
              );
              if (clockOut) {
                stopTimer();
              }
            }}
            disabled={isStopped}
          >
            STOP
          </button>
        </div>
      </li>
    </>
  );
}
