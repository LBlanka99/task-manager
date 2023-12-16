import { IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonCheckbox, IonChip, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuButton, IonMenuToggle, IonModal, IonPage, IonPopover, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from "@ionic/react";
import "./TaskList.css";
import { useEffect, useState } from "react";
import { Group, Tag, Task, User } from "../theme/interfaces";
import TaskCard from "../components/TaskCard";
import { add, arrowDown, arrowUp, caretDownOutline, caretDownSharp, caretUpOutline, caretUpSharp, checkmarkCircleOutline, checkmarkCircleSharp, close, closeCircleOutline, closeCircleSharp, eye, funnelOutline, funnelSharp, options, toggle, trailSignOutline, trashBinOutline, trashBinSharp } from "ionicons/icons";
import { menuController } from '@ionic/core/components';

interface TaskListPageProps {
    group: Group | undefined;
}

const TaskListPage: React.FC<TaskListPageProps> = ({group}) => {
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [displayTasks, setDisplayTasks] = useState<Task[]>(allTasks);
    const [isAscending, setIsAscending] = useState(true);
    const [arrowIcon, setArrowIcon] = useState(arrowDown);
    const [sortBy, setSortBy] = useState("");
    const [minDate, setMinDate] = useState<string>("2023-12-01");
    const [maxDate, setMaxDate] = useState<string>("2030-12-31");
    const [minPoint, setMinPoint] = useState<number>();
    const [maxPoint, setMaxPoint] = useState<number>();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [selectedAssignees, setSelectedAssignees] = useState<User[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<Number[]>([]);
    const [isAnyFilter, setIsAnyFilter] = useState(false);

    useEffect(() => {
        if (isAscending) {
            setArrowIcon(arrowDown);
        } else {
            setArrowIcon(arrowUp);
        }
    }, [isAscending]);

    const fetchTasks = async () => {
        const apiAddress = `http://localhost:5180/api/v1/tasks/${group?.id}`;

        const response = await fetch(apiAddress, {credentials: "include"});
        return await response.json();
    }

    useEffect(() => {
        if (group) {
            fetchTasks().then(res => {
                setAllTasks(res);
                setDisplayTasks(res);
            });
        }            
    }, [group])

    useEffect(() => {
        if (sortBy) {
            const direction = isAscending ? 1 : -1;
            if (sortBy == "title") {
                displayTasks.sort((a, b) => (a[sortBy].toLocaleLowerCase() > b[sortBy].toLocaleLowerCase()) ? 1*direction : -1*direction);
            } else {
                displayTasks.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1*direction : -1*direction);
            }            
            setAllTasks([...allTasks]);
        }

    }, [isAscending, sortBy]);

    useEffect(() => {
        if (minDate != "2023-12-01" || maxDate != "2030-12-31" || maxPoint || maxPoint || selectedAssignees.length > 0 || selectedStatuses.length > 0 || selectedTags.length > 0) {
            setIsAnyFilter(true);
        } else {
            setIsAnyFilter(false);
        }

    }, [minDate, maxDate, minPoint, maxPoint, selectedAssignees, selectedStatuses, selectedTags]);

    const handleAssigneesSelect = (checked: boolean, member: User) => {
        if (checked) {
            selectedAssignees.push(member);
        } else {
            const index = selectedAssignees.findIndex(u => u.id === member.id);
            if (index > -1) {
                selectedAssignees.splice(index, 1);
            }            
        }
        setSelectedAssignees([...selectedAssignees]);
    };

    const handleTagSelect = (checked: boolean, tag: Tag) => {
        if (checked) {
            selectedTags.push(tag);
        } else {
            const index = selectedTags.findIndex(t => t.id === tag.id);
            if (index > -1) {
                selectedTags.splice(index, 1);
            }            
        }
        setSelectedTags([...selectedTags]);
    };

    const handleStatusSelect = (checked: boolean, status: number) => {
        if (checked) {
            selectedStatuses.push(status);
        } else {
            const index = selectedStatuses.findIndex(s => s === status);
            if (index > -1) {
                selectedStatuses.splice(index, 1);
            }            
        }
        setSelectedStatuses([...selectedStatuses]);
    };

    const handleFilter = async () => {
        let resultTasks = allTasks;
        if (minDate) {
            resultTasks = resultTasks.filter(t => new Date(t.deadline) >= new Date(minDate))
        }
        if (maxDate) {
            resultTasks = resultTasks.filter(t => new Date(t.deadline) <= new Date(maxDate))
        }
        if (minPoint) {
            resultTasks = resultTasks.filter(t => Number(t.points) >= minPoint);
        }
        if (maxPoint) {
            resultTasks = resultTasks.filter(t => Number(t.points) <= maxPoint);
        }
        if (selectedTags.length > 0) {
            resultTasks = resultTasks.filter(t => selectedTags.some(c => t.tags.some(tag => tag.id === c.id)));
        }
        if (selectedAssignees.length > 0) {
            resultTasks = resultTasks.filter(t => selectedAssignees.some(u => t.assignees.some(user => user.id === u.id)));
        }
        if (selectedStatuses.length > 0) {
            resultTasks = resultTasks.filter(t => selectedStatuses.includes(t.status));
        }

        setDisplayTasks([...resultTasks]);
        await menuController.close("end");
    };

    const handleDeleteFilters = () => {
        location.reload();
    }


    return (
        <>
        <IonMenu side="end" contentId="filter-content">
                <IonHeader mode="ios" style={{padding: "3px"}}>
                    <IonToolbar class="ion-align-items-center">
                        <IonButton aria-label="close filter menu" fill="clear" onClick={async () => await menuController.close("end")}>
                            <IonIcon aria-hiddenC icon={close} slot="icon-only" color="primary" style={{borderRadius: "55px"}} />
                        </IonButton>
                        <IonTitle class="ion-text-center">
                            Szűrés
                        </IonTitle>
                        
                    </IonToolbar>
                </IonHeader>
                <IonContent class="ion-padding">
                   
                    <IonAccordionGroup expand="inset">
                        <IonAccordion>                        
                            <IonItem className="filter-header" slot="header" color="primary">
                                Határidő                                    
                            </IonItem>
                            <div slot="content" className="ion-padding-top ion-padding-bottom">
                            <IonItem>
                            <IonGrid className="date-grid">
                                <IonRow class="ion-align-items-center">
                                    <IonCol className="date-filter-col"><IonLabel>Ettől:</IonLabel></IonCol>
                                    <IonCol class="ion-text-end second-col"><IonDatetimeButton  datetime="min-datepicker"></IonDatetimeButton></IonCol>
                                </IonRow>
                            </IonGrid>
                            </IonItem>
                            <IonModal keepContentsMounted>
                                <IonDatetime
                                    id="min-datepicker"
                                    presentation="date"
                                    firstDayOfWeek={1}
                                    showDefaultButtons
                                    locale="hu-HU"
                                    doneText="Kész"
                                    cancelText="Mégsem"
                                    max="2030-12-31"
                                    value={minDate}
                                    onIonChange={e => setMinDate(e.detail.value!.slice(0, 10) as string)}
                                />
                                </IonModal>

                            <IonItem>
                            <IonGrid className="date-grid">
                                <IonRow className="data-row" class="ion-align-items-center">
                                    <IonCol className="date-filter-col"><IonLabel>Eddig:</IonLabel></IonCol>
                                    <IonCol class="ion-text-end second-col"><IonDatetimeButton datetime="max-datepicker"></IonDatetimeButton></IonCol>
                                </IonRow>
                            </IonGrid>
                            </IonItem>
                            </div>

                            <IonModal keepContentsMounted>
                                <IonDatetime
                                    id="max-datepicker"
                                    presentation="date"
                                    firstDayOfWeek={1}
                                    showDefaultButtons
                                    locale="hu-HU"
                                    doneText="Kész"
                                    cancelText="Mégsem"
                                    max="2030-12-31"
                                    value={maxDate}
                                    onIonChange={e => setMaxDate(e.detail.value!.slice(0, 10) as string)}
                                />
                                </IonModal>

                        
                        </IonAccordion>
                        <IonAccordion>
                            <IonItem className="filter-header" slot="header" color="primary">
                                Felelősök
                            </IonItem>
                            <div slot="content" className="ion-padding-top ion-padding-bottom">
                            {group?.members.map((member, index) => (
                                <IonItem key={index}>
                                    <IonCheckbox onIonChange={c => handleAssigneesSelect(c.detail.checked, member)}>{member.userName}</IonCheckbox>
                                </IonItem>
                            ))}
                            </div>
                        </IonAccordion>
                        <IonAccordion>
                            <IonItem className="filter-header" slot="header" color="primary">
                                Pontszám
                            </IonItem>
                            <div slot="content" className="ion-padding-top ion-padding-bottom">
                            <IonItem>
                                <IonInput
                                    type="number"
                                    label="Minimum pont:"
                                    inputmode="numeric"
                                    min={1}
                                    max={100}
                                    clearInput
                                    value={minPoint}
                                    onIonInput={i => setMinPoint(Number(i.detail.value))}
                                />
                            </IonItem>
                            <IonItem>
                                <IonInput
                                    type="number"
                                    label="Maxium pont:"
                                    inputmode="numeric"
                                    min={1}
                                    max={100}
                                    clearInput
                                    value={maxPoint}                                    
                                    onIonInput={i => setMaxPoint(Number(i.detail.value))}
                                />
                            </IonItem>
                            </div>
                        </IonAccordion>
                        <IonAccordion>
                            <IonItem className="filter-header" slot="header" color="primary">
                                Címkék
                            </IonItem>
                            <div className="ion-padding-top ion-padding-bottom" slot="content">
                            {group?.tags.map((tag, index) => (
                                <IonItem key={index}>
                                    <IonCheckbox onIonChange={c => handleTagSelect(c.detail.checked, tag)}>{tag.name}</IonCheckbox>
                                </IonItem>
                            ))}
                            </div>
                        </IonAccordion>
                        <IonAccordion>
                            <IonItem className="filter-header" slot="header" color="primary">
                                Státusz
                            </IonItem>
                            <div className="ion-padding-top ion-padding-bottom" slot="content">
                            <IonItem>
                                <IonCheckbox onIonChange={c => handleStatusSelect(c.detail.checked, 0)}>Folyamatban</IonCheckbox>
                            </IonItem>
                            <IonItem>
                                <IonCheckbox onIonChange={c => handleStatusSelect(c.detail.checked, 1)}>Jóváhagyásra vár</IonCheckbox>
                            </IonItem>
                            <IonItem>
                                <IonCheckbox onIonChange={c => handleStatusSelect(c.detail.checked, 2)}>Befejezett</IonCheckbox>
                            </IonItem>
                            </div>                            
                        </IonAccordion>
                    </IonAccordionGroup>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                            
                                
                                    <IonButton color="dark" onClick={handleFilter}>Mutasd</IonButton>
                                
                            </IonCol>
                            <IonCol>
                            
                                
                                    <IonButton disabled={!isAnyFilter} color="light" onClick={handleDeleteFilters}>Összes törlése</IonButton>
                                
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonMenu>
        <IonPage id="filter-content">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Feladatok</IonTitle>
                </IonToolbar>               
            </IonHeader>
            {group ?
            <>
            
            <IonItem lines="full">
                <IonItem lines="none">
                <IonChip>
                    <IonButton fill="clear" aria-label="desc/asc order" className="ion-no-padding ion-no-margin" style={{marginRight: "10px"}} onClick={() => setIsAscending(!isAscending)}>
                        <IonIcon slot="icon-only" aria-hidden icon={arrowIcon} color="light"></IonIcon>
                    </IonButton>                             
                    <IonSelect
                        placeholder="Rendezés"
                        interface="popover"
                        toggleIcon={caretDownOutline}
                        expandedIcon={caretUpOutline}
                        onIonChange={(c) => setSortBy(c.detail.value)}
                    >
                        <IonSelectOption class="ion-text-center"value="" disabled>-- Rendezés --</IonSelectOption>             
                        <IonSelectOption value="title">Név</IonSelectOption>
                        <IonSelectOption value="deadline">Határidő</IonSelectOption>
                        <IonSelectOption value="points">Pont</IonSelectOption>
                    </IonSelect>
                </IonChip>
                </IonItem>
                <IonItem lines="none">
                    <IonChip aria-label="filter" onClick={async() => await menuController.open("end")}>
                        <IonIcon aria-hidden icon={options} color="light" style={{marginRight: "13px", marginLeft: "4px"}}/>
                        <IonLabel style={{marginRight: "3px"}}>Szűrés</IonLabel>
                    </IonChip>
                </IonItem>
            </IonItem>
            

            <IonContent>
                {displayTasks.length > 0 ? displayTasks.map((task, index) => (
                    <TaskCard key={index} taskModel={task}></TaskCard>
                ))
                :
                <IonText className="no-tasks"><p>Nincsenek feladatok.</p></IonText>
                }
                <IonFab slot="fixed" vertical="bottom" horizontal="end" class="ion-margin">
                    <IonFabButton aria-label="new-task" color={"primary"} routerLink="/new-task" routerDirection="forward">
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonContent>
            </>
            :
            <div></div>
            }
        </IonPage>
        </>
    );
};

export default TaskListPage;