import { IonAlert, IonAvatar, IonBackButton, IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonRoute, IonRow, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import "./TaskDetails.css";
import { Tag, Task, User } from "../theme/interfaces";
import { useEffect, useState } from "react";
import { calendar, person, pricetag, informationCircle, calendarOutline, calendarSharp, personOutline, personSharp, trophyOutline, trophySharp, pricetagOutline, pricetagSharp, hourglassOutline, hourglassSharp, informationCircleOutline, trashOutline, trashSharp, pencilOutline, pencilSharp, checkmarkCircleOutline, checkmarkCircleSharp, checkmarkOutline, checkmarkSharp, happyOutline, happySharp } from "ionicons/icons";

interface TaskDetailsProps {
    task: Task
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
    const [taskStatusText, setTaskStatusText] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        switch (task.status) {
            case 0:
                return setTaskStatusText("folyamatban");
            case 1:
                return setTaskStatusText("jóváhagyásra vár");
            case 2:
                return setTaskStatusText("befejezett");
        };
    }, []);

    const handleDeleteTask = async () => {
        const apiAddress = `http://localhost:5180/api/v1/tasks/${task.id}`;

        const init: RequestInit = {
            method: "DELETE",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
        }
        const response = await fetch(apiAddress, init);

        location.reload();
    }

    return (
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
                <IonList inset style={{ margin: "auto", maxWidth: "500px" }}>
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
                                        <IonChip style={{ width: "33px", height: "33px" }}>{assignee.userName[0].toUpperCase()}</IonChip>
                                    )}
                                    <IonLabel slot="end" style={{ marginRight: "0px", marginLeft: "10px" }}>{assignee.userName}</IonLabel>
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
                        <IonIcon ios={hourglassOutline} md={hourglassSharp} slot="start" color="primary" />
                        <IonLabel color="primary">Státusz</IonLabel>
                        <IonText>{taskStatusText}</IonText>
                    </IonItem>
                    <IonItem>
                        <IonIcon ios={informationCircleOutline} slot="start" color="primary" />
                        <IonLabel color="primary">Leírás</IonLabel>
                    </IonItem>
                    <IonTextarea style={{ marginLeft: "57.59px" }} readonly>
                        {task.description ? task.description : "Nincs leírás"}
                    </IonTextarea>

                    <IonGrid>
                        <IonRow className="edit-buttons-container">
                            <IonCol>
                                <IonChip color="danger" style={{ height: "39px" }} onClick={() => setShowAlert(true)}>
                                    <IonLabel class="edit-button">Törlés</IonLabel>
                                    <IonIcon style={{ width: "22px", height: "22px" }} ios={trashOutline} md={trashSharp} />
                                </IonChip>
                            </IonCol>
                            <IonCol class="ion-text-end">
                                <IonChip color="primary" style={{ height: "39px" }}>
                                    <IonLabel class="edit-button">Szerkesztés</IonLabel>
                                    <IonIcon style={{ width: "22px", height: "22px" }} ios={pencilOutline} md={pencilSharp} />
                                </IonChip>
                            </IonCol>
                        </IonRow>
                        <IonRow class="ion-text-center ion-margin-top">
                            <IonCol>
                                <IonChip color="success" >
                                    <IonLabel class="done-button">Kész!</IonLabel>
                                    <IonIcon style={{ width: "25px", height: "25px" }} ios={happyOutline} md={happySharp} />
                                </IonChip>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonList>

                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={"Törlés megerősítése"}
                    message={"Biztos vagy benne, hogy törölni szeretnéd ezt a feladatot?"}
                    buttons={[
                        {
                            text: "Mégsem",
                            role: "cancel",
                        },
                        {
                            text: "Törlés",
                            role: "confirm",
                            handler: handleDeleteTask
                        },
                    ]}
                />

            </IonContent>
        </>
    );
};

export default TaskDetails;
