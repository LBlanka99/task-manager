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
import { addCircleOutline, addCircleSharp, copyOutline, copySharp, duplicateOutline, duplicateSharp, libraryOutline, librarySharp, logInOutline, logInSharp, logOutOutline, logOutSharp, personCircleOutline, personCircleSharp, personOutline, personSharp, pricetagsOutline, pricetagsSharp } from 'ionicons/icons';
import './Menu.css';
import { useEffect, useState } from 'react';
import { Group, User } from '../theme/interfaces';
import { baseUrl } from '../theme/variables';

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

const appPagesWhenLoggedInAsTaskCreator: AppPage[] = [
  {
    title: "Profilom",
    url: "/my-profile",
    iosIcon: personOutline,
    mdIcon: personSharp
  },
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
    title: "Elvégzett feladatok",
    url: "/old-tasks",
    iosIcon: libraryOutline,
    mdIcon: librarySharp
  },
  {
    title: "Címkék",
    url: "/tags",
    iosIcon: pricetagsOutline,
    mdIcon: pricetagsSharp
  }  
]

const appPagesWhenLoggedInAsSimpleUser: AppPage[] = [
  {
    title: "Profilom",
    url: "/my-profile",
    iosIcon: personOutline,
    mdIcon: personSharp
  },
  {
    title: "Feladatok",
    url: "/tasks",
    iosIcon: copyOutline,
    mdIcon: copySharp
  },
  {
    title: "Elvégzett feladatok",
    url: "/old-tasks",
    iosIcon: libraryOutline,
    mdIcon: librarySharp
  },
  {
    title: "Címkék",
    url: "/tags",
    iosIcon: pricetagsOutline,
    mdIcon: pricetagsSharp
  }  
]

interface MenuProps {
  currentUser: User | undefined;
  currentGroup: Group | undefined;
  setUserCookie: (cookie: string | undefined) => void;
}

const Menu: React.FC<MenuProps> = ({currentUser, currentGroup, setUserCookie}) => {
  const location = useLocation();


  const handleLogout = async () => {
    await fetch(`${baseUrl}users/log-out`, {credentials: "include"});
    setUserCookie(undefined);
  }

  const menuItems = currentUser ? (currentUser.roles.includes("taskCreator") ? appPagesWhenLoggedInAsTaskCreator : appPagesWhenLoggedInAsSimpleUser) : appPagesWhenLoggedOut;

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent scrollY={false}>
        <IonList id="inbox-list">
          <IonListHeader>{currentUser ? currentGroup?.name : "TenniVenni"}</IonListHeader>           
          <IonNote>{currentUser?.userName}</IonNote>          
          <IonMenuToggle autoHide={false}>
            {currentUser ?
            <IonItem routerLink={"/login"} routerDirection="none" lines="none" detail={false} onClick={handleLogout}>
              <IonIcon color="primary" aria-hidden="true" slot="start" ios={logOutOutline} md={logOutSharp} />
              <IonLabel>Kijelentkezés</IonLabel>
            </IonItem>            
            :
            <IonItem className={location.pathname === "/login" ? 'selected' : ''} routerLink={"/login"} routerDirection="none" lines="none" detail={false}>
              <IonIcon color="primary" aria-hidden="true" slot="start" ios={logInOutline} md={logInSharp} />
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
                  <IonIcon color="primary" aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
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
