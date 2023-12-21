import { IonApp, IonNav, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import LoginPage from './pages/Login';
import NewGroupPage from './pages/NewGroup';
import { useEffect, useState } from 'react';
import TaskListPage from './pages/TaskList';
import { User } from './theme/interfaces';
import NewTaskPage from './pages/NewTask';
import TagListPage from './pages/TagList';
import TaskDetails from './components/TaskDetails';
import ProfilPage from './pages/Profil';

setupIonicReact();

const App: React.FC = () => {
  const [userCookie, setUserCookie] = useState<string | undefined>(document.cookie?.split("; ").find(row => row.startsWith("id")));
  const [currentUser, setCurrentUser] = useState();
  const [currentGroup, setCurrentGroup] = useState();

  useEffect(() => {
    if (userCookie) {
      const id = userCookie.split("=")[1];
      
      const groupApiAddress = `http://localhost:5180/api/v1/groups/${id}`;
      fetch(groupApiAddress, {credentials: "include"}).then(res => res.json()).then(res => setCurrentGroup(res));

      const userApiAddress = `http://localhost:5180/api/v1/users/${id}`;
      fetch(userApiAddress, {credentials: "include"}).then(res => res.json()).then(res => setCurrentUser(res));
    } else {
      setCurrentUser(undefined);
      setCurrentGroup(undefined);
    }
    
  }, [userCookie]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu currentUser={currentUser} currentGroup={currentGroup} setUserCookie={setUserCookie}/>
          <IonRouterOutlet id="main">
            <Route path="/" exact>
              <Redirect to="/login" />
            </Route>
            <Route path="/login" exact>
              <LoginPage setUserCookie={setUserCookie} />
            </Route>
            <Route path="/new-group" component={NewGroupPage} exact />
            <Route path="/tasks" exact>
              <TaskListPage group={currentGroup} currentUser={currentUser} statusFilter={[0, 1]} />
            </Route>
            <Route path="/new-task" exact>
              <NewTaskPage group={currentGroup} />
            </Route>
            <Route path="/tags" exact>
              <TagListPage group={currentGroup} />
            </Route>
            <Route path="/tasks/:taskId">
              <TaskDetails currentUser={currentUser} />
            </Route>
            <Route path="/my-profile">
              <ProfilPage currentUser={currentUser} />
            </Route>
            <Route path="/old-tasks">
              <TaskListPage group={currentGroup} currentUser={currentUser} statusFilter={[2]} />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
