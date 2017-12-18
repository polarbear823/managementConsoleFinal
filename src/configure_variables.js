export const ROOT_URL = "http://192.168.1.45:8080/";
export const ROOT_ALERTS_API_URL = `${ROOT_URL}api/alerts/`;
export const ROOT_PREPROC_RULES_URL = `${ROOT_URL}api/preprocrules/`;
export const SEVERITY_NUM_ARRAY = [1,2,3,4,5,-1];
export const SEVERITY_STRING_MAP = new Map().set(1, "Normal")
											.set(2, "Warning")
											.set(3, "Minor")
											.set(4, "Major")
											.set(5, "Critical")
											.set(-1, "Unknown");
export const ALERT_PROPERTIES = [
	{ value: 'alertUID', label: 'alertUID' },
	{ value: 'severity', label: 'severity' },
	{ value: 'alertObj', label: 'alertObj' },
	{ value: 'alertTime', label: 'alertTime' },
	{ value: 'receiveTime', label: 'receiveTime' },
	{ value: 'alertMsg', label: 'alertMsg' },
];
export function getSeverityClassName(severity) {
	switch(severity){
				case 1:
				return 'tr-severity-1';
				break;
				case 2:
				return 'tr-severity-2';
				break;
				case 3:
				return 'tr-severity-3';
				break;
				case 4:
				return 'tr-severity-4';
				break;
				case 5:
				return 'tr-severity-5';
				break;
				default:
				return 'tr-severity-other';
			}
}