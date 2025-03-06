import React from "react";
import axios from 'axios';

const Consent = () => {
    let dynamicURL = window.location.origin.includes('staging') ? 'https://staging.newfi.com/' : 'https://newfi.com/';
    const API_URL = dynamicURL || 'https://staging.newfi.com/';

    return(
        <div style={{ fontSize: '11px', lineHeight: '12px', padding: '10px 0' }}>
            By submitting my contact information, I affirmatively consent to receive text messages and phone calls (which may employ automatic telephone dialing systems) from Newfi at the residential or cellular telephone number I provided above. Standard message and data rates may apply. I am not required to provide this consent as a condition to using this service. I am free to cancel this authorization at any time. Reply “STOP” to any text message to opt out of future messaging. View Newfi’s&nbsp;
            <span style={{ color: '#ff6600' }}>
                <a style={{ color: '#ff6600' }} href={`${API_URL}information/`}>Terms of Use</a>
            </span>&nbsp;and&nbsp;
            <span style={{ color: '#ff6600' }}>
                <a style={{ color: '#ff6600' }} href={`${API_URL}privacy-policy/`}>Privacy Policy.</a>
            </span>&nbsp;Call Newfi at 888-316-3934 for further information.
        </div>
    )
}

export default Consent;