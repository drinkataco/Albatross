// velocity-animation
import Velocity from 'velocity-animate';

// Bootstrap native
import Bootstrap from 'bootstrap.native';

// admin-lite
import BoxRefresh from 'AdminLite/build/js/src/BoxRefresh';
import BoxWidget from 'AdminLite/build/js/src/BoxWidget';
import ControlSidebar from 'AdminLite/build/js/src/ControlSidebar';
import DirectChat from 'AdminLite/build/js/src/DirectChat';
import Layout from 'AdminLite/build/js/src/Layout';
import PushMenu from 'AdminLite/build/js/src/PushMenu';
import TodoList from 'AdminLite/build/js/src/TodoList';
import Tree from 'AdminLite/build/js/src/Tree';

// Bind admin-lite modules
const binder = () => {
  BoxRefresh.bind();
  BoxWidget.bind();
  ControlSidebar.bind();
  DirectChat.bind();
  Layout.bind();
  PushMenu.bind();
  TodoList.bind();
  Tree.bind();
};

document.addEventListener('DOMContentLoaded', binder);