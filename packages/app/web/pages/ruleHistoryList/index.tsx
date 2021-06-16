import React from 'react';
import 'antd/dist/antd.css';
import { TRuleItem } from '@/@types/ruleHistory';
import { RULETYPE } from '@/enum/ruleHistory';
import { Tabs, Divider, List } from 'antd';
import './index.less';
import { StickyContainer, Sticky } from 'react-sticky';
import _ from 'lodash';

const { TabPane } = Tabs;

const renderTabBar = (props: any, DefaultTabBar: any) => (
    <Sticky bottomOffset={80}>
        {({ style }: any) => (
            <DefaultTabBar {...props} className="site-custom-tab-bar" style={{ ...style }} />
        )}
    </Sticky>
);

type TInitProps = {
    list: TRuleItem[];
};

const RenderList = (props: TInitProps) => (
    <List
        itemLayout="horizontal"
        pagination={{ total: props?.list?.length }}
        dataSource={props.list}
        renderItem={(item: TRuleItem) => (
            <List.Item>
                <List.Item.Meta
                    title={item.status === 0 ? '（已失效）' : `（生效）${item.fileName}`}
                />
                <List.Item.Meta title={`${item.dStartTime}至${item.dEndTime}`} />
                <a
                    href={`/download?fileName=${item.fileName}.pdf&url=${encodeURIComponent(
                        item.filePath
                    )}`}>
                    下载
                </a>
            </List.Item>
        )}
    />
);

export default (props: TInitProps) => {
    const groupList = _.groupBy(props?.list, 'ruleType');
    const tabKeys = Reflect.ownKeys(groupList);

    return (
        <React.Fragment>
            <Divider orientation="center" className="coustom-divider">
                历史规则
            </Divider>
            <StickyContainer>
                <Tabs defaultActiveKey="0" size="large" renderTabBar={renderTabBar}>
                    <TabPane tab="全部" key="0">
                        <RenderList list={props?.list || []} />
                    </TabPane>
                    {tabKeys.map((type: any) => (
                        <TabPane tab={RULETYPE[type]} key={type}>
                            <RenderList list={groupList[type] || []} />
                        </TabPane>
                    ))}
                </Tabs>
            </StickyContainer>
        </React.Fragment>
    );
};
