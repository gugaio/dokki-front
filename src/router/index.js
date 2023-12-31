import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CameraView from '../views/CameraView.vue'
import DocumentView from '../views/DocumentView.vue'
import UploadView from '../views/UploadView.vue'
import DatasetView from '../views/DatasetView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/camera',
      name: 'camera',
      component: CameraView
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadView
    },
    {
      path: '/doc/:id',
      name: 'doc',
      component: DocumentView
    },
    {
      path: '/dataset',
      name: 'dataset',
      component: DatasetView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
