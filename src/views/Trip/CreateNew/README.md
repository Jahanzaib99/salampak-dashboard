# Trip Uploading Form

[![Build Status][travis-svg]]
[![dependency status][deps-svg]]
[![dev dependency status][dev-deps-svg]]
[![License][license-image]][license-url]

## Description
The form is developed keeping in mind that it is able to upload 
new and edit the previous events.

## Component Hierarchy
### Parent Component
> src>views>Trip>CreateNew>index.jsx
This component serves a pivotal role by managing the state of the whole form.
Two APIs for fetching <strong>vendors</strong> and <strong>event data by id</strong> 
are called by specific functions. 

Following are the key functions performed by this component,
<ul>
    <li>It fetches vendors from database and populates the vendors element</li>
    <li>It listens for a dynamic route, which eventually 
    fetches the data of an event</li>
    <li>It controls the swipeable tabs which are various child components
    for their own functionality</li>
    <li>It marks a green check on each tab, once it is submitted</li>
    <li>It controls the enability of each tab by looking after its preceding components</li>
    <li>Once a Vendor is selected, this component passes the associated vendor id to all 
    the child components</li>
    <li>It controls all the data flow of itself and its child components</li>
</ul>


### Child Components
<ol>
    <li><strong>UploadTrip</strong><br />
    This uses a POST api which follows the vendor id, it submits 
    general event information</li>
    <li><strong>TripItinerary</strong><br />
    This uses a PUT api which follows the vendor id, it submits 
    itinerary of the event</li>
    <li><strong>AddOns</strong><br />
    This uses a PUT api which follows the vendor id, it submits 
    itinerary of the event</li>
    <li><strong>Packages</strong><br />
    This uses a PUT api which follows the vendor id, it submits 
    packages of the event</li>
    <li><strong>Details</strong><br />
    This uses a PUT api which follows the vendor id, it submits 
    extra details of the event</li>
    <li><strong>Images</strong><br />
    This uses a PUT api which follows the vendor id, it uploads 
    images of the event</li>
</ol>