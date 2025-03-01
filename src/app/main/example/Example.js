import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import RabitPageSimple from '@rabit/core/RabitPageSimple';
import DemoContent from '@rabit/core/DemoContent';

const Root = styled(RabitPageSimple)(({ theme }) => ({
  '& .RabitPageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
  '& .RabitPageSimple-toolbar': {},
  '& .RabitPageSimple-content': {},
  '& .RabitPageSimple-sidebarHeader': {},
  '& .RabitPageSimple-sidebarContent': {},
}));

function ExamplePage(props) {
  const { t } = useTranslation('examplePage');

  return (
    <Root
      header={
        <div className="p-24">
          <h4>{t('TITLE')}</h4>
        </div>
      }
      content={
        <div className="p-24">
          <h4>Content</h4>
          <br />
          <DemoContent />
        </div>
      }
      scroll="content"
    />
  );
}

export default ExamplePage;
