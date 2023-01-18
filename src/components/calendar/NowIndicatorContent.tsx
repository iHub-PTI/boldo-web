import React from 'react';


function NowIndicatorContent(eventInfo) {

  // this functions get the time in format HH:MM
  function getTime() {
    let date = new Date();

    return (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
  }

  return (
    <div className="flex">
      <div className="bg-orange-500 rounded-full items-center justify-center mb-8 px-1 -mt-3">
        <p className="text-white font-medium text-xs py-1">{getTime()}</p>
      </div>
      <div className="h-1 line w-full"></div>
    </div>
  );
}

export default NowIndicatorContent;