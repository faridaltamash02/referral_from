import React, { useState, useEffect } from 'react';
import Util from '../common/util';
const Dashboard = () =>{
  const [userLists, setUserLists] = useState([]);
  const util = new Util();
    useEffect(() => {
        //getUsers
        fetch('http://localhost/wordpress/wp-json/newfi/v1/getUsers')
        .then(response => {
          if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
          return response.json();
        })
          .then(result => {
            console.log(result);
            setUserLists(result);
          }).catch((error) => {
            console.error('There was an error!', error);
          })
      },[])
    return(
        <div>
        <p> List of Users </p>
          <table className="nf-table w-fit">
            <thead>
              <tr className="flex justifySB alignC">
                <th className="textC p10">Name</th>
                <th className="textC p10">Phone Number</th>
                <th className="textC p10">Email</th>
                <th className="textC p10">Location</th>
                <th className="textC p10">URL</th>
                <th className="textC p10">UTM Source</th>
                <th className="textC p10">UTM Medium</th>
                <th className="textC p10">UTM compaign</th>
                <th className="textC p10">UTM Term</th>
                <th className="textC p10">Compaign Time</th>
                <th className="textC p10">GAD_Source</th>
                <th className="textC p10">Gclid</th>
                <th className="textC p10">GAD_Source</th>
                <th className="textC p10">Ip Address</th>
                <th className="textC p10">Created At</th>
              </tr>
            </thead>
            <tbody>
              {userLists.map((row, index) => (
                  <tr className="flex justifySB alignC" key={index}>
                    <td className="textC p10">{row.first_name} {row.last_name}</td>
                    <td className="textC p10">{row.phone_number}</td>
                    <td className="textC p10">{row.email_id}</td>
                    <td className="textC p10">{row.city}, {row.state}, {row.country}</td>
                    <td className="textC p10">{row.url}</td> 
                    <td className="textC p10">{row.utm_source}</td>
                    <td className="textC p10">{row.utm_medium}</td>
                    <td className="textC p10">{row.utm_campaign}</td>
                    <td className="textC p10">{row.utm_term}</td>
                    <td className="textC p10">{row.campaign_type}</td>
                    <td className="textC p10">{row.gad_source}</td>
                    <td className="textC p10">{row.gclid}</td>
                    <td className="textC p10">{row.ip_address}</td>
                    <td className="textC p10">{util.formatDate(row.created_at)}</td>
                </tr>
              ))
            } 
            </tbody>
        </table>
        </div>
    )
}
export default Dashboard;