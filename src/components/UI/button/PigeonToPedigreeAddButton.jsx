import React, {useState} from 'react';
import '../../../styles/custom-styles.css';
import PigeonToPedigreeDialog from "../form/dialog/PigeonToPedigreeDialog";

const PigeonToPedigreeAddButton = ({childId, pigeons, reloadPedigree}) => {
    const [openAddForm, setOpenAddForm] = useState(false);

    const toggleOpen = (state) => {
      setOpenAddForm(state)
    }

    return (
        <>
            <button className="pigeon-add-button" onClick={() => toggleOpen(true)}>
                Добавить
                <div className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path fill="currentColor"
                              d="M18 10h-4v-4c0-1.104-.896-2-2-2s-2 .896-2 2l.071 4h-4.071c-1.104 0-2 .896-2 2s.896 2 2 2l4.071-.071-.071 4.071c0 1.104.896 2 2 2s2-.896 2-2v-4.071l4 .071c1.104 0 2-.896 2-2s-.896-2-2-2z"></path>
                    </svg>
                </div>
            </button>
            <PigeonToPedigreeDialog
                open={openAddForm}
                setOpen={setOpenAddForm}
                childId={childId}
                pigeons={pigeons}
                reloadPedigree={reloadPedigree}
            />
        </>

    );
};

export default PigeonToPedigreeAddButton;