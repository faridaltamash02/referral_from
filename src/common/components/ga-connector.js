import {React, useEffect, useState} from 'react';

const GaConnector = ({onUpdate})=>{
    const user = {};
    const [clientIP, setClientIP] = useState();
    useEffect(() => {
        // fetch("https://api.ipify.org/?format=json", function(e) {
        //     //client_ip = e.ip;
        //     setClientIP(e.ip);
        // });
    },[])
    useEffect(() => {
        const user = {};  // Initialize inside useEffect
        user.gaConnector = new Object();
        user.gaConnector.gaconnector_First_Click_Landing_Page__c = document.getElementById("urlComplete")?.value || '';
        user.gaConnector.gaconnector_First_Click_Landing_Page__c = document.getElementById("fc_landing")?.value || ''; 
        user.gaConnector.gaconnector_First_Click_Medium__c = document.getElementById("fc_medium")?.value || '';
        user.gaConnector.gaconnector_First_Click_Referrer__c = document.getElementById("fc_referrer")?.value || '';
        user.gaConnector.gaconnector_First_Click_Source__c = document.getElementById("fc_source")?.value || '';
        user.gaConnector.gaconnector_First_Click_Term__c = document.getElementById("fc_term")?.value || '';
        user.gaConnector.gaconnector_First_Click_Campaign__c = document.getElementById("fc_campaign")?.value || '';
        user.gaConnector.gaconnector_First_Click_Channel__c = document.getElementById("fc_channel")?.value || '';
        user.gaConnector.gaconnector_First_Click_Content__c = document.getElementById("fc_content")?.value || '';
        user.gaConnector.gaconnector_GCLID__c = document.getElementById("gclid")?.value || '';
        user.gaConnector.gaconnector_Google_Analytics_Client_ID__c = document.getElementById("GA_Client_ID")?.value || '';
        user.gaConnector.gaconnector_IP_Address__c = clientIP;
        user.gaConnector.gaconnector_Last_Click_Campaign__c = document.getElementById("lc_campaign")?.value || '';
        user.gaConnector.gaconnector_Last_Click_Channel__c = document.getElementById("lc_channel")?.value || '';
        user.gaConnector.gaconnector_Last_Click_Content__c = document.getElementById("lc_content")?.value || '';
        //user.gaConnector.gaconnector_Last_Click_Landing_Page__c = document.getElementById("lc_landing")?.value || '';
        user.gaConnector.gaconnector_Last_Click_Landing_Page__c = document.getElementById("urlComplete")?.value || '';
        user.gaConnector.gaconnector_Last_Click_Medium__c = document.getElementById("lc_medium")?.value || '';
        user.gaConnector.gaconnector_Last_Click_Referrer__c = document.getElementById("lc_referrer")?.value || '';
        user.gaConnector.gaconnector_Last_Click_Source__c = document.getElementById("lc_source")?.value || '';
        user.gaConnector.gaconnector_Last_Click_Term__c = document.getElementById("lc_term")?.value || '';
        user.gaConnector.gaconnector_Latitude_from_IP__c = document.getElementById("latitude")?.value || '';
        user.gaConnector.gaconnector_Longitude__c = document.getElementById("longitude")?.value || '';
        user.gaConnector.gaconnector_Pages_visited__c = document.getElementById("page_visits")?.value || '';
        user.gaConnector.gaconnector_Operating_System__c = document.getElementById("OS")?.value || '';
        user.gaConnector.gaconnector_Pages_visited__c = document.getElementById("pages_visited_list")?.value || '';
        user.gaConnector.gaconnector_Time_Spent_on_Website__c = document.getElementById("time_passed")?.value || '';
        user.gaConnector.gaconnector_Time_Zone__c = document.getElementById("time_zone")?.value || '';
        user.gaConnector.gaconnector_Browser__c = document.getElementById("browser")?.value || '';
        user.gaConnector.gaconnector_Country__c = document.getElementById("country")?.value || '';
        user.gaConnector.gaconnector_City__c = document.getElementById("city")?.value || '';
        // ... other data assignments (similar to above) ...

        onUpdate(user);  // Now called inside useEffect, after render
    }, []);
    /* GA Connector Code */
   
    
    return(
        <div> <textarea id="browser" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKnv"></textarea> <textarea id="city" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKnw"></textarea> <textarea id="country" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKnx"></textarea> <textarea id="fc_campaign" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKny"></textarea> <textarea id="fc_channel" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKnz"></textarea> <textarea id="fc_content" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKo0"></textarea> <textarea id="fc_landing" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKo1"></textarea> <textarea id="fc_medium" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKo2"></textarea> <textarea id="fc_referrer" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKo3"></textarea> <textarea id="fc_source" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKo4"></textarea> <textarea id="fc_term" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKo5"></textarea> <textarea id="gclid" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKo6"></textarea> <textarea id="GA_Client_ID" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKo7"></textarea> <textarea id="ip_address" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKo9"></textarea> <textarea id="lc_campaign" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoA"></textarea> <textarea id="lc_channel" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoB"></textarea> <textarea id="lc_content" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoC"></textarea> <textarea id="lc_landing" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoD"></textarea> <textarea id="lc_medium" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoE"></textarea> <textarea id="lc_referrer" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoF"></textarea> <textarea id="lc_source" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoG"></textarea> <textarea id="lc_term" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoH"></textarea> <textarea id="latitude" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoI"></textarea> <textarea id="longitude" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoK"></textarea> <textarea id="page_visits" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoL"></textarea> <textarea id="OS" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoM"></textarea> <textarea id="pages_visited_list" className="ga_fileds" style={{ display: 'none' }} name="00N2G00000CxKoN" rows="5" wrap="soft"></textarea> <textarea id="time_passed" className="ga_fileds" style={{ display: 'none' }} name="00N2G00000CxKoO"></textarea> <textarea id="time_zone" className="ga_fileds" style={{ display: 'none' }} maxLength="255" name="00N2G00000CxKoQ"></textarea> <textarea id="urlComplete" className="ga_fileds" style={{ display: 'none' }} maxLength="255"></textarea> </div>
    )
}

export default GaConnector;