import React, {useEffect, useState } from 'react';
import { Container} from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        let activities: Activity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split('T')[0];
          activities.push(activity);
        })
        setActivities(activities);       
        setLoading(false); 
      })
  }, [])

  const handleSelectedActivity = (id:string) => {
    setSelectedActivity(activities.find(x => x.id === id));
    setEditMode(false);
  }

  const handleCancelSelectActivity = () =>{
    setSelectedActivity(undefined);
    setEditMode(false);
  }

  const handleFormOpen = (id?: string) =>{

    id ? handleSelectedActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  const handleFormClose = () => {
    setEditMode(false);
  }

  const handleCreateOrEditActivity = (activity: Activity) =>{
    setSubmitting(true);

    if(activity.id){
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter( x => x.id !== activity.id), activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }else{
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }

    // 1st line remove the edited activity if it exists, then merge new activity with items of activities 
    // 2snd line just merge new activity  and create new array and set the state
    // activity.id 
    //   ? setActivities([...activities.filter( x => x.id !== activity.id), activity])
    //   : setActivities([...activities, {...activity, id: uuid()}]);
  }

  const handleDeleteActivity = (id: string) =>{
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })    
  }

  if(loading) return <LoadingComponent content='Loading app' />

  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '7em'}}>      
        <ActivityDashboard 
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectedActivity}
          cancelSelectedActivity={handleCancelSelectActivity} 
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          />
      </Container>
    </>
  );
}

export default App;
