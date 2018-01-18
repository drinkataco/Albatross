// velocity-animation
import Velocity from 'velocity-animate';

// admin-lite
import BoxRefresh from 'AdminLite/build/js/src/BoxRefresh';
import BoxWidget from 'AdminLite/build/js/src/BoxWidget';
import ControlSidebar from 'AdminLite/build/js/src/ControlSidebar';
import Layout from 'AdminLite/build/js/src/Layout';
import PushMenu from 'AdminLite/build/js/src/PushMenu';
import Tree from 'AdminLite/build/js/src/Tree';

// Bind admin-lite modules
const binder = () => {
  BoxRefresh.bind();
  BoxWidget.bind();
  ControlSidebar.bind();
  Layout.bind();
  PushMenu.bind();
  Tree.bind();
};

document.addEventListener('DOMContentLoaded', binder);
