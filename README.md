# litXtend
A pun on Lit and Extend, it suggests extension and modernization.


Based
http://sourceforge.net/projects/openext

http://sourceforge.net/projects/superext/


  <target name="Core" file="$output\ext-core.js">
    <include name="core\DomHelper.js" />
    <include name="core\Template.js" />
    <include name="core\DomQuery.js" />
    <include name="util\Observable.js" />
    <include name="core\EventManager.js" />
    <include name="core\Element.js" />
    <include name="core\Fx.js" />
    <include name="core\CompositeElement.js" />
    <include name="data\Connection.js" />
    <include name="core\UpdateManager.js" />
    <include name="util\DelayedTask.js" />
  </target>

  <target name="Everything" file="$output\ext-all.js">
    <include name="core\DomHelper.js" />
    <include name="core\Template.js" />
    <include name="core\DomQuery.js" />
    <include name="util\Observable.js" />
    <include name="core\EventManager.js" />
    <include name="core\Element.js" />
    <include name="core\Fx.js" />
    <include name="core\CompositeElement.js" />
    <include name="data\Connection.js" />
    <include name="core\UpdateManager.js" />
    <include name="util\Date.js" />
    <include name="util\DelayedTask.js" />
    <include name="util\TaskMgr.js" />
    <include name="util\MixedCollection.js" />
    <include name="util\JSON.js" />
    <include name="util\Format.js" />
    <include name="util\XTemplate.js" />
    <include name="util\CSS.js" />
    <include name="util\ClickRepeater.js" />
    <include name="util\KeyNav.js" />
    <include name="util\KeyMap.js" />
    <include name="util\TextMetrics.js" />
    <include name="dd\DDCore.js" />
    <include name="dd\DragTracker.js" />
    <include name="dd\ScrollManager.js" />
    <include name="dd\Registry.js" />
    <include name="dd\StatusProxy.js" />
    <include name="dd\DragSource.js" />
    <include name="dd\DropTarget.js" />
    <include name="dd\DragZone.js" />
    <include name="dd\DropZone.js" />
    <include name="data\SortTypes.js" />
    <include name="data\Record.js" />
    <include name="data\StoreMgr.js" />
    <include name="data\Store.js" />
    <include name="data\SimpleStore.js" />
    <include name="data\JsonStore.js" />
    <include name="data\DataField.js" />
    <include name="data\DataReader.js" />
    <include name="data\DataProxy.js" />
    <include name="data\MemoryProxy.js" />
    <include name="data\HttpProxy.js" />
    <include name="data\ScriptTagProxy.js" />
    <include name="data\JsonReader.js" />
    <include name="data\XmlReader.js" />
    <include name="data\ArrayReader.js" />
    <include name="data\MapReader.js" />
    <include name="data\Tree.js" />
    <include name="data\GroupingStore.js" />
    <include name="widgets\ComponentMgr.js" />
    <include name="widgets\Component.js" />
    <include name="widgets\Action.js" />
    <include name="widgets\Layer.js" />
    <include name="widgets\Shadow.js" />
    <include name="widgets\BoxComponent.js" />
    <include name="widgets\SplitBar.js" />
    <include name="widgets\Container.js" />
    <include name="widgets\layout\ContainerLayout.js" />
    <include name="widgets\layout\FitLayout.js" />
    <include name="widgets\layout\CardLayout.js" />
    <include name="widgets\layout\AnchorLayout.js" />
    <include name="widgets\layout\ColumnLayout.js" />
    <include name="widgets\layout\BorderLayout.js" />
    <include name="widgets\layout\FormLayout.js" />
    <include name="widgets\layout\AccordionLayout.js" />
    <include name="widgets\layout\TableLayout.js" />
    <include name="widgets\layout\AbsoluteLayout.js" />
    <include name="widgets\Viewport.js" />
    <include name="widgets\Panel.js" />
    <include name="widgets\Window.js" />
    <include name="widgets\WindowManager.js" />
    <include name="widgets\PanelDD.js" />
    <include name="state\Provider.js" />
    <include name="state\StateManager.js" />
    <include name="state\CookieProvider.js" />
    <include name="widgets\DataView.js" />
    <include name="widgets\ColorPalette.js" />
    <include name="widgets\DatePicker.js" />
    <include name="widgets\TabPanel.js" />
    <include name="widgets\Button.js" />
    <include name="widgets\SplitButton.js" />
    <include name="widgets\CycleButton.js" />
    <include name="widgets\Toolbar.js" />
    <include name="widgets\PagingToolbar.js" />
    <include name="widgets\Resizable.js" />
    <include name="widgets\Editor.js" />
    <include name="widgets\MessageBox.js" />
    <include name="widgets\tips\Tip.js" />
    <include name="widgets\tips\ToolTip.js" />
    <include name="widgets\tips\QuickTip.js" />
    <include name="widgets\tips\QuickTips.js" />
    <include name="widgets\tree\TreePanel.js" />
    <include name="widgets\tree\TreeEventModel.js" />
    <include name="widgets\tree\TreeSelectionModel.js" />
    <include name="widgets\tree\TreeNode.js" />
    <include name="widgets\tree\AsyncTreeNode.js" />
    <include name="widgets\tree\TreeNodeUI.js" />
    <include name="widgets\tree\TreeLoader.js" />
    <include name="widgets\tree\TreeFilter.js" />
    <include name="widgets\tree\TreeSorter.js" />
    <include name="widgets\tree\TreeDropZone.js" />
    <include name="widgets\tree\TreeDragZone.js" />
    <include name="widgets\tree\TreeEditor.js" />
    <include name="widgets\menu\Menu.js" />
    <include name="widgets\menu\MenuMgr.js" />
    <include name="widgets\menu\BaseItem.js" />
    <include name="widgets\menu\TextItem.js" />
    <include name="widgets\menu\Separator.js" />
    <include name="widgets\menu\Item.js" />
    <include name="widgets\menu\CheckItem.js" />
    <include name="widgets\menu\Adapter.js" />
    <include name="widgets\menu\DateItem.js" />
    <include name="widgets\menu\ColorItem.js" />
    <include name="widgets\menu\DateMenu.js" />
    <include name="widgets\menu\ColorMenu.js" />
    <include name="widgets\form\Field.js" />
    <include name="widgets\form\TextField.js" />
    <include name="widgets\form\TriggerField.js" />
    <include name="widgets\form\TextArea.js" />
    <include name="widgets\form\NumberField.js" />
    <include name="widgets\form\DateField.js" />
    <include name="widgets\form\Combo.js" />
    <include name="widgets\form\LovCombo.js" />
    <include name="widgets\form\Checkbox.js" />
    <include name="widgets\form\Radio.js" />
    <include name="widgets\form\Hidden.js" />
    <include name="widgets\form\BasicForm.js" />
    <include name="widgets\form\Form.js" />
    <include name="widgets\form\FieldSet.js" />
    <include name="widgets\form\HtmlEditor.js" />
    <include name="widgets\form\TimeField.js" />
    <include name="widgets\form\Label.js" />
    <include name="widgets\form\Action.js" />
    <include name="widgets\form\VTypes.js" />
    <include name="widgets\grid\GridPanel.js" />
    <include name="widgets\grid\GridView.js" />
    <include name="widgets\grid\GroupingView.js" />
    <include name="widgets\grid\ColumnDD.js" />
    <include name="widgets\grid\ColumnSplitDD.js" />
    <include name="widgets\grid\GridDD.js" />
    <include name="widgets\grid\ColumnModel.js" />
    <include name="widgets\grid\AbstractSelectionModel.js" />
    <include name="widgets\grid\RowSelectionModel.js" />
    <include name="widgets\grid\CellSelectionModel.js" />
    <include name="widgets\grid\EditorGrid.js" />
    <include name="widgets\grid\GridEditor.js" />
    <include name="widgets\grid\PropertyGrid.js" />
    <include name="widgets\grid\RowNumberer.js" />
    <include name="widgets\grid\CheckboxSelectionModel.js" />
    <include name="widgets\LoadMask.js" />
    <include name="widgets\ProgressBar.js" />
    <include name="debug.js" />
  </target>

  <target name="Ext Base" file="$output\adapter\ext\ext-base.js">
    <include name="core\Ext.js" />
    <include name="adapter\ext-base.js" />
  </target>

  <target name="Widget Core" file="$output\package\widget-core.js">
    <include name="widgets\ComponentMgr.js" />
    <include name="widgets\Component.js" />
    <include name="widgets\BoxComponent.js" />
    <include name="widgets\Layer.js" />
    <include name="widgets\Shadow.js" />
  </target>