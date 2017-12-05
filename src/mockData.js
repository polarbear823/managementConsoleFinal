export const MOCK_ALERTS = [
  		{
  			alertUID: 1,
  			severity: 1,
  			alertObj: "255.255.255.0",
  			alertTime: 1511151440000,
  			receiveTime: 1511151713000,
  			alertMsg: "some message about alert"
  		},
  		{
  			alertUID: 2,
  			severity: 2,
  			alertObj: "255.255.255.1",
  			alertTime: 1511151440000,
  			receiveTime: 1511151713000,
  			alertMsg: "some message about alert"
  		},
  		{
  			alertUID: 3,
  			severity: 3,
  			alertObj: "255.255.255.0",
  			alertTime: 1511151440000,
  			receiveTime: 1511151713000,
  			alertMsg: "some message about alert"
  		}
  	];

export const MOCK_FILTER_LIST = [
      "AllEvents",
      "MinorSeverity"
    ];

export const MOCK_VIEW_LIST = [
      {
        viewName: "defaultView",
        showProperties: ["alertUID", "severity", "alertObj", "alertTime", "receiveTime", "alertMsg"]
      },
      {
        viewName: "noTimeView",
        showProperties: ["alertUID", "severity", "alertObj", "alertMsg"]
      }
    ];

export const MOCK_ACTION_MENU = [
      "Change Severity",
      "Delete"
    ];