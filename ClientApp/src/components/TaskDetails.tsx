import { IonAlert, IonAvatar, IonBackButton, IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonRoute, IonRow, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import "./TaskDetails.css";
import { Tag, Task, User } from "../theme/interfaces";
import { useEffect, useState } from "react";
import { calendar, person, pricetag, informationCircle, calendarOutline, calendarSharp, personOutline, personSharp, trophyOutline, trophySharp, pricetagOutline, pricetagSharp, hourglassOutline, hourglassSharp, informationCircleOutline, trashOutline, trashSharp, pencilOutline, pencilSharp, checkmarkCircleOutline, checkmarkCircleSharp, checkmarkOutline, checkmarkSharp, happyOutline, happySharp } from "ionicons/icons";

interface TaskDetailsProps {
    task: Task
}

const TaskDetails: React.FC<TaskDetailsProps> = ({task}) => {
    const [taskStatusText, setTaskStatusText] = useState("");

    useEffect(() => {
        switch(task.status) {
            case 0:
                return setTaskStatusText("folyamatban");
            case 1:
                return setTaskStatusText("jóváhagyásra vár");
            case 2:
                return setTaskStatusText("befejezett");
        };
    }, []);

    

    return(
        <>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>{task.title}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding" color="light">
                <IonList  inset style={{margin: "auto", maxWidth: "500px"}}>
                <IonItem>
            <IonIcon ios={calendarOutline} md={calendarSharp} slot="start" color="primary" />
            <IonLabel color="primary">Határidő</IonLabel>
            <IonText>{task.deadline.toString()}</IonText>
          </IonItem>
          <IonItem>
            <IonIcon ios={personOutline} md={personSharp} slot="start" color="primary" />
            <IonLabel color="primary">Felelősök</IonLabel>
            <IonList>
              {task.assignees.map((assignee: User, index) => (
                <IonItem key={index} lines="none" className="item-inner-full">
                    {assignee.profilPicture !== undefined ? (
                        <IonAvatar key={index} >
                            <img alt="profile picture" src={assignee.profilPicture!} />
                        </IonAvatar>
                    ) : (
                        <IonChip style={{width:"33px", height:"33px"}}>{assignee.userName[0].toUpperCase()}</IonChip>
                    )}                   
                  <IonLabel slot="end" style={{marginRight: "0px", marginLeft: "10px"}}>{assignee.userName}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonItem>
          <IonItem>
            <IonIcon ios={trophyOutline} md={trophySharp} slot="start" color="primary" />
            <IonLabel color="primary">Kapható pont fejenként</IonLabel>
            <IonText>{task.points.toString()}</IonText>
          </IonItem>
          <IonItem>
            <IonIcon ios={pricetagOutline} md={pricetagSharp} slot="start" color="primary" />
            <IonLabel color="primary">Címkék</IonLabel>
            <IonList>
              {task.tags.map((tag: Tag) => (
                <IonItem className="item-inner-full" key={tag.id}>
                  <IonChip style={{ backgroundColor: tag.color, marginRight: "0px" }}>{tag.name}</IonChip>
                </IonItem>
              ))}
            </IonList>
          </IonItem>
          <IonItem>
            <IonIcon ios={hourglassOutline} md={hourglassSharp} slot="start" color="primary"/>
            <IonLabel color="primary">Státusz</IonLabel>
            <IonText>{taskStatusText}</IonText>
          </IonItem> 
          <IonItem>
            <IonIcon ios={informationCircleOutline} slot="start" color="primary" />
            <IonLabel color="primary">Leírás</IonLabel>            
          </IonItem>
          <IonTextarea style={{marginLeft: "57.59px"}} readonly>
            {task.description ? task.description : "Nincs leírás"}
          </IonTextarea>

          
                            
            </IonList>

                
            
            </IonContent>
        </>
    );
};

export default TaskDetails;
