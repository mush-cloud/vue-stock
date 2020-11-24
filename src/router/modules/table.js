/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    // {
    //   path: 'dynamic-table',
    //   component: () => import('@/views/table/dynamic-table/index'),
    //   name: 'DynamicTable',
    //   meta: { title: 'dynamicTable' }
    // },
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/table/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'dragTable' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'inlineEditTable' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'inlineEditTable' }
    // },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table'),
      name: 'ComplexTable',
      meta: { title: 'complexTable', icon: 'shopping' }
    },

    {
      path: 'jycl-table',
      component: () => import('@/views/table/jycl-table'),
      name: 'JyclTable',
      meta: { title: 'JyclTable', icon: 'bug' }
    }
    // ,
    // {
    //   path: 'tomorrow-table',
    //   component: () => import('@/views/table/tomorrowl-table'),
    //   name: 'TommorowTable',
    //   meta: { title: 'TommorowTable', icon: 'el-icon-cloudy-and-sunny' }
    // }
  ]
}
export default tableRouter
