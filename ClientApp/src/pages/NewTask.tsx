import { IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonMenuButton, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import "./NewTask.css";
import { useEffect, useRef, useState } from "react";
import { Group, Tag, User } from "../theme/interfaces";

interface NewTaskPageProps {
    group: Group | undefined;
}

const NewTaskPage: React.FC<NewTaskPageProps> = ({group}) => {
    const [taskName, setTaskName] = useState("");
    const [deadline, setDeadline] = useState<string | string[] >();
    const [assignees, setAssignees] = useState<User[]>();
    const [points, setPoints] = useState<number>();
    const [tags, setTags] = useState<Tag[]>();
    const [description, setDescription] = useState("");

    console.log(group);

    const createNewTask = () => {
        //TODO: send request to server
    }



    return (
        <IonPage>
            
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>Új feladat létrehozása</IonTitle>
                </IonToolbar>
            </IonHeader>
            {group ? 
            <IonContent fullscreen className="ion-padding" scrollY={false}>
                <IonText class="ion-text-center">
                    <h3 style={{marginBottom: "55px"}}>Itt tudsz új feladatot létrehozni:)</h3>
                </IonText>
                <form onSubmit={createNewTask}>
                    <IonItem>
                    <IonInput
                        label="Feladat neve"
                        labelPlacement="floating"
                        placeholder="ide írd a feladat nevét"
                        value={taskName}
                        clearInput
                        onIonInput={(i) => setTaskName(i.detail.value!)}
                        required                                               
                    />
                    </IonItem>

                    <IonItem>
                    <IonSelect
                        label="Felelős(ök)"
                        placeholder="Válaszd ki a feladat felelőseit"
                        multiple
                        value={assignees}
                        onIonChange={(e) => setAssignees(e.detail.value)}
                    >
                        {group.members.map((member, index)=> (
                            <IonSelectOption key={index} value={member}>{member.userName}</IonSelectOption>
                        ))}
                    </IonSelect>
                    </IonItem>

                    <IonItem>
                    <IonInput
                        label="Kapható pontok fejenként"
                        labelPlacement="floating"
                        type="number"
                        inputmode="numeric"
                        min={1}
                        max={100}
                        value={points}
                        clearInput
                        onIonInput={(i) => setPoints(Number(i.detail.value))}
                    />
                    </IonItem>

                    <IonItem>
                    <IonGrid className="date-grid">
                        <IonRow className="data-row" class="ion-align-items-center">
                            <IonCol className="first-col"><IonLabel>Határidő</IonLabel></IonCol>
                            <IonCol class="ion-text-end second-col"><IonDatetimeButton datetime="datepicker"></IonDatetimeButton></IonCol>
                        </IonRow>
                    </IonGrid>
                    </IonItem>
                    
                    <IonModal keepContentsMounted>
                    <IonDatetime
                        id="datepicker"
                        presentation="date"
                        firstDayOfWeek={1}
                        showDefaultButtons
                        locale="hu-HU"
                        doneText="Kész"
                        cancelText="Mégsem"
                        max="2030-12-31"
                        min={new Date().toISOString()}
                        onIonChange={e => setDeadline(e.detail.value!)}
                    />
                    </IonModal>

                    <IonItem>
                    <IonSelect
                        label="Címkék"
                        placeholder="Válassz címkéket a feladathoz"
                        multiple
                        value={tags}
                        onIonChange={e => setTags(e.detail.value)}
                    >
                        {group.tags.map((tag, index) => (
                            <IonSelectOption key={index} value={tag}>{tag.name}</IonSelectOption>
                        ))}
                        //TODO: this part is not completed
                        <IonSelectOption value={"new"}>Új címke</IonSelectOption>
                    </IonSelect>
                    </IonItem>
                    
                    <IonItem>
                    <IonTextarea
                        label="Leírás"
                        labelPlacement="floating"
                        inputMode="text"
                        placeholder="A feladat részletes leírása"
                        value={description}
                        onIonInput={(i) => setDescription(i.detail.value!)}
                        autoGrow
                    />
                    </IonItem>

                   

                </form>
            </IonContent>
            :
            <div></div>
            }
        </IonPage>
    );
};

export default NewTaskPage;
