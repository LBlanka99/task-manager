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
import { addCircleOutline, addCircleSharp, copyOutline, copySharp, duplicateOutline, duplicateSharp, logInOutline, logInSharp, logOutOutline, logOutSharp, pricetagsOutline, pricetagsSharp } from 'ionicons/icons';
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
    title: "Új csoport létrehozása",
    url: "/new-group",
    iosIcon: addCircleOutline,
    mdIcon: addCircleSharp
  }
];

const appPagesWhenLoggedIn: AppPage[] = [
  {
    title: "Feladatok",
    url: "/tasks",
    iosIcon: copyOutline,
    mdIcon: copySharp
  },
  {
    title: "Új feladat létrehozása",
    url: "/new-task",
    iosIcon: duplicateOutline,
    mdIcon: duplicateSharp
  },
  {
    title: "Címkék",
    url: "/tags",
    iosIcon: pricetagsOutline,
    mdIcon: pricetagsSharp
  }
  
]

interface MenuProps {
  userCookie: string | undefined;
  setUserCookie: (cookie: string | undefined) => void;
}

const Menu: React.FC<MenuProps> = ({userCookie, setUserCookie}) => {
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");

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

  useEffect(() => {
    if (userCookie) {
      const id = userCookie.split("=")[1];
      getUserName(id).then(res => setUserName(res));
      getGroupName(id).then(res => setGroupName(res));
    } else {
      setUserName("");
      setGroupName("");
    }
  }, [userCookie]);

  const handleLogout = async () => {
    await fetch("http://localhost:5180/api/v1/users/log-out", {credentials: "include"});
    setUserCookie(undefined);
  }

  const menuItems = userCookie ? appPagesWhenLoggedIn : appPagesWhenLoggedOut;

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent scrollY={false}>
        <IonList id="inbox-list">
          <IonListHeader>{userCookie ? groupName : "TenniVenni"}</IonListHeader>           
          <IonNote>{userName}</IonNote>          
          <IonMenuToggle autoHide={false}>
            {userCookie ?
            <IonItem routerLink={"/login"} routerDirection="none" lines="none" detail={false} onClick={handleLogout}>
              <IonIcon aria-hidden="true" slot="start" ios={logOutOutline} md={logOutSharp} />
              <IonLabel>Kijelentkezés</IonLabel>
            </IonItem>            
            :
            <IonItem className={location.pathname === "/login" ? 'selected' : ''} routerLink={"/login"} routerDirection="none" lines="none" detail={false}>
              <IonIcon aria-hidden="true" slot="start" ios={logInOutline} md={logInSharp} />
              <IonLabel>Bejelentkezés</IonLabel>
            </IonItem>

          }
          </IonMenuToggle>          
        </IonList>

        <IonList id="inbox-list">
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
