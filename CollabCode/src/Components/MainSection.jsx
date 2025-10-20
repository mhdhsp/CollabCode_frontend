import React, { useEffect } from 'react'
import EditorSection from './EditorSection'
import RightSidebar from './RightSidebar'

function MainSection({selectedRoom}) {
    useEffect(()=>{
        console.log(selectedRoom);
        
    },[selectedRoom])
  return (
    <div>
        <EditorSection/>
        <RightSidebar/>
    </div>
  )
}

export default MainSection