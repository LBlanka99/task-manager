import { IonAlert, IonButton, IonButtons, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import "./TagList.css";
import { Group, Tag } from "../theme/interfaces";
import { add, addCircleOutline, addCircleSharp, pencil, pencilOutline, pencilSharp, trash, trashOutline, trashSharp } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";

interface TagListPageProps {
    group: Group | undefined;
}

const TagListPage: React.FC<TagListPageProps> = ({group}) => {
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("#FA8072");
    const [editingTagName, setEditingTagName] = useState(editingTag?.name);
    const [editingTagColor, setEditingTagColor] = useState(editingTag?.color);
    const [deletingTag, setDeletingTag] = useState<Tag | null>(null);

    const createModal = useRef<HTMLIonModalElement>(null);

    useEffect(() => {
        if (editingTag) {
            setEditingTagName(editingTag.name);
            setEditingTagColor(editingTag.color);
        }
    }, [editingTag]);


    const handleDeleteTag = async () => {
        const apiAddress = `http://localhost:5180/api/v1/tags/${deletingTag?.id}`;

        const init: RequestInit = {
            method: "DELETE",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
        }
        const response = await fetch(apiAddress, init);

        setDeletingTag(null);

        location.reload();
    }

    const handleSaveEdit = async (e:any) => {
        e.preventDefault();
        const apiAddress = `http://localhost:5180/api/v1/tags/${editingTag?.id}`;

        const updatedTag = {
            "name": editingTagName,
            "color": editingTagColor,
        };
        console.log(updatedTag);

        const init: RequestInit = {
            method: "PUT",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
            body: JSON.stringify(updatedTag),
        };

        const response = await fetch(apiAddress, init);

        setEditingTag(null);

        //location.reload();
    };

    const handleCreateTag = async (e: any) => {
        e.preventDefault();
        
        const apiAddress = `http://localhost:5180/api/v1/tags/${group?.id}/new-tag`;

        const newTag = {
            "name": newTagName,
            "color": newTagColor
        };

        const init:RequestInit = {
            method: "POST",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
            body: JSON.stringify(newTag),
        };
        const response = await fetch(apiAddress, init);

        setNewTagName("");
        setNewTagColor("#FA8072");

        createModal.current?.dismiss();

        location.reload();
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>Címkék</IonTitle>
                </IonToolbar>
            </IonHeader>
            {group ? 
                <IonContent class="ion-padding">

                    <IonList>
                        {group.tags.map((tag, index) => (
                            <IonChip key={index} style={{backgroundColor: tag.color}}>
                                <p className="ion-no-margin ion-margin-end" style={{fontSize: "20px"}}>{tag.name}</p>
                                
                                <IonButton className="ion-no-padding" aria-label="edit" fill="clear" onClick={() => setEditingTag(tag)} style={{padding: "0px"}}>
                                    <IonIcon slot="icon-only" color="light" aria-hidden ios={pencilOutline} md={pencilSharp} />
                                </IonButton>
                                <IonButton className="ion-no-padding" aria-label="delete" fill="clear" onClick={() => setDeletingTag(tag)} style={{padding: "0px"}}>
                                    <IonIcon slot="icon-only" color="light" aria-hidden ios={trashOutline} md={trashSharp} />
                                </IonButton>                            
                            </IonChip>
                        ))}
                    </IonList>

                    <IonFab slot="fixed" vertical="bottom" horizontal="end" class="ion-margin">
                        <IonFabButton id="open-new-tag-dialog" aria-label="new-tag" color={"primary"}>
                            <IonIcon icon={add}></IonIcon>
                        </IonFabButton>
                    </IonFab>

                    
                    <IonModal className="tag-modal" id="new-tag-modal" trigger="open-new-tag-dialog" ref={createModal}>
                        <IonContent scrollY={false}>
                            <IonToolbar>
                                <IonButtons slot="start">
                                    <IonButton color="primary" onClick={() => createModal.current?.dismiss()}>
                                    Mégsem
                                    </IonButton>
                                </IonButtons>
                                <IonTitle>Új címke</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton color="primary" type="submit" form="new-tag-form">
                                    Létrehozás
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                            <form id="new-tag-form" onSubmit={handleCreateTag}>
                                <IonList>
                                    <IonItem style={{marginTop: "15px"}}>                                        
                                        <IonInput
                                            label="Címke neve"
                                            placeholder="Ide írd a címke nevét"
                                            value={newTagName}
                                            clearInput
                                            onIonInput={(i) => setNewTagName(i.detail.value!)}
                                            required                                          
                                        />
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Címke színe</IonLabel>
                                        <input
                                            type="color"
                                            value={newTagColor}                                            
                                            onChange={(i) => setNewTagColor(i.target.value)}                                            
                                        />
                                    </IonItem>                                    
                                </IonList>
                            </form>
                        </IonContent>
                    </IonModal>

                    <IonModal className="tag-modal" id="update-tag-modal" isOpen={editingTag != null}>
                        <IonContent scrollY={false}>
                            <IonToolbar>
                                <IonButtons slot="start">
                                    <IonButton color="primary" onClick={() => setEditingTag(null)}>
                                    Mégsem
                                    </IonButton>
                                </IonButtons>
                                <IonTitle>Szerkesztés</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton color="primary" type="submit" form="update-tag-form">
                                    Mentés
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                            <form id="update-tag-form" onSubmit={handleSaveEdit}>
                                <IonList>
                                    <IonItem style={{marginTop: "15px"}}>                                        
                                        <IonInput
                                            label="Címke neve"
                                            value={editingTagName}
                                            clearInput
                                            onIonInput={(i) => setEditingTagName(i.detail.value!)}
                                            required                                          
                                        />
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Címke színe</IonLabel>
                                        <input
                                            type="color"
                                            value={editingTagColor}                                       
                                            onChange={(i) => setEditingTagColor(i.target.value!)}                                            
                                        />
                                    </IonItem>                                    
                                </IonList>
                            </form>
                        </IonContent>
                    </IonModal>
                    
                    <IonAlert
                        isOpen={deletingTag != null}
                        onDidDismiss={() => setDeletingTag(null)}
                        header={"Törlés megerősítése"}
                        message={"Biztos vagy benne, hogy törölni szeretnéd ezt a címkét?"}
                        buttons={[
                        {
                            text: "Mégsem",
                            role: "cancel",
                            handler: () => {
                                setDeletingTag(null);
                            }                          
                        },
                        {
                            text: "Törlés",
                            role: "confirm",
                            handler: handleDeleteTag
                        },
                    ]}
                    />
                </IonContent>
            :
                <div></div>
            }

            
        </IonPage>
    );
};

export default TagListPage;