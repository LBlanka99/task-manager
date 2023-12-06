import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { addCircleOutline, addCircleSharp, logInOutline, logInSharp, logOutOutline, logOutSharp } from 'ionicons/icons';
import './Menu.css';
import { useEffect, useState } from 'react';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPagesWhenLoggedOut: AppPage[] = [
  {
    title: "Bejelentkezés",
    url: "/login",
    iosIcon: logInOutline,
    mdIcon: logInSharp
  },
  {
    title: "Új csoport létrehozása",
    url: "/new-group",
    iosIcon: addCircleOutline,
    mdIcon: addCircleSharp
  }
];

const appPagesWhenLoggedIn: AppPage[] = [
  {
    title: "Kijelentkezés",
    url: "/login",
    iosIcon: logOutOutline,
    mdIcon: logOutSharp
  }
]

const getAuthCookie = () => {
  const userCookie = document.cookie.split("; ").find(row => row.startsWith("id"));
  return userCookie;
}

const getUserName = async (id: string) => {
  const apiAddress = `http://localhost:5180/api/v1/users/${id}`;

  const response = await fetch(apiAddress, {credentials: "include"});
  const user = await response.json();
  return user.userName;
}

const getGroupName = async (id: string) => {
  const apiAddress = `http://localhost:5180/api/v1/groups/${id}`;

  const response = await fetch(apiAddress, {credentials: "include"});
  const group = await response.json();
  return group.name;
}

const Menu: React.FC = () => {
  const location = useLocation();
  const userCookie = getAuthCookie();
  const isLoggedIn = userCookie !== undefined;
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      const id = userCookie.split("=")[1];
      getUserName(id).then(res => setUserName(res));
      getGroupName(id).then(res => setGroupName(res));
    }
  }, [userCookie]);

  

  const menuItems = isLoggedIn ? appPagesWhenLoggedIn : appPagesWhenLoggedOut;

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent scrollY={false}>
        <IonList id="inbox-list">
          <IonListHeader>{isLoggedIn ? groupName : "TenniVenni"}</IonListHeader>
          {isLoggedIn && 
            <IonNote>{userName}</IonNote>
          }
          
          {menuItems.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
