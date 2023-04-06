import React ,{lazy,Suspense}from 'react'
import './style.scss'
import { AnimatePresence } from "framer-motion";
import { useRoutes  } from 'react-router-dom';

const Books  = lazy(
  async()=>await import('../Component/Books')
);

const Add  = lazy(
  async()=>await import('../Component/Add')
);

const Update  = lazy(
  async()=>await import('../Component/Update')
);


function Index() {
  const element = useRoutes([
    {
      path:'/',
      element:<Books></Books>
    },
    {
      path:'/add',
      element:<Add></Add>
    },
    {
      path:'/update/:id',
      element:<Update></Update>
    },
  ])
  return (
    <div className="router flex-center">
      <Suspense fallback={<p>loading</p>}>
          {element}
      </Suspense>
      
    </div>
     
  )
}

export default Index