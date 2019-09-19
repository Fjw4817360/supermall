<template>
  <div class="home" style="width:100%">
    <el-container v-loading="Dataloading">
      <el-main>
        <!---顶部筛选--->
        <div class="handle-box">
          <el-row :gutter="20">
            <!--筛选左边-->
            <el-col :span="22">
              <div
                class="searchlist"
                v-for="(item,i) in searchParam"
                :key="i"
                v-show="item.type == 'VARCHAR' && item.label != '主键' && item.label != '修改人ID' && item.label != '修改人姓名'"
              >
                <!-- v-show="item.type == 'VARCHAR' && item.label != '主键' && item.label != '修改人ID' && item.label != '修改人姓名'" -->
                <template>
                  <span>{{item.label}}</span>
                  <el-input v-model="item.value" size="mini" placeholder class="handle-input mr10"></el-input>
                </template>
              </div>
              <div
                class="searchlist"
                v-for="(item,index) in searchParam"
                :key="index+'k'"
                v-show="item.type =='DATETIME'"
              >
                <template>
                  <span>创建时间：</span>
                  <el-date-picker
                    v-model="item.value"
                    size="mini"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="center"
                  ></el-date-picker>
                </template>
              </div>
            </el-col>

            <!-- <el-col :span="20">
                            <el-col :span="6">
                                <span>关键词</span>
                                <el-input v-model="Keyword"  size="mini" placeholder="" class="handle-input mr10"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <span>重点类型：</span>
                                <el-select v-model="importType" size="mini" placeholder="请选择" class="handle-select mr10">
                                    <el-option v-for="item in importTypeList" :key="item.id" :label="item.name" value="item.id"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6">
                                <span>来源：</span>
                                <el-select v-model="Source" size="mini" placeholder="请选择" class="handle-select mr10">
                                    <el-option v-for="item in sourceList" :key="item.id" :label="item.name" value="item.id"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6">
                                <span>编辑人：</span>
                                <el-input v-model="Editor" size="mini" placeholder="请输入编辑人" class="handle-input mr10"></el-input>
                            </el-col>
                            <el-col :span="12">
                                <span>创建时间：</span>
                                <el-date-picker
                                v-model="CreationTime"
                                size="mini" 
                                type="datetimerange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right">
                                </el-date-picker>
                            </el-col>
                            <el-col :span="12">
                                <span>最新编辑时间：</span>
                                <el-date-picker
                                v-model="NewEditTime"
                                size="mini" 
                                type="datetimerange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right">
                                </el-date-picker>
                            </el-col>
            </el-col>-->
            <!--筛选右边-->
            <el-col :span="2">
              <div class="search-box search-box-btn">
                <a href="javascript:;" @click="handlesearch(searchParam)">
                  <em></em>筛选
                </a>
                <a href="javascript:;" @click="handleclean(searchParam)">清空</a>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 表格 -->
        <el-row>
          <el-col :span="24" class="tip-len-btn">
            <b>
              <i class="el-icon-tickets"></i>&nbsp;&nbsp;数据总数（
              <span>{{tableDataNum}}）</span>
            </b>
            <a href="javascript:;" @click="handladd()">
              <em></em>新建
            </a>
          </el-col>
          <!--表格-->
          <el-col :span="24">
            <el-table :data="tableData" border stripe style="width: 100%">
              <el-table-column type="index" width></el-table-column>
              <el-table-column
                v-for="(item,i) in tableHeader"
                :key="i"
                :label="item.label.substring(0,10)"
                :type="item.type"
                :prop="item.prop"
                width
                align
              >
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="light"
                    :content="scope.row[item.prop]"
                    placement="bottom"
                  >
                    <span
                      class="scope-con"
                      :class="/^[0-9]+$/.test(scope.row[item.prop])? 'home-right' : 'home-center'"
                    >{{scope.row[item.prop]}}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleClickedit(scope.row)" icon="el-icon-edit">编辑</el-button>
                  <el-button size="mini" @click="handleClickdel(scope.row)" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>

          <!-- 分页 -->
          <el-col :span="24" class="toolbar" style="margin-top: 10px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageParam.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageParam.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableDataNum"
            ></el-pagination>
          </el-col>

          <!--新建界面-->
          <el-dialog title="新建" :visible.sync="addFormVisible" :close-on-click-modal="true">
            <el-form label-width="90px" ref="addForm">
              <el-form-item
                v-for="(item,i) in addForm"
                :key="i"
                :label="item.label.substring(0,8)+':'"
                :prop="item.prop"
              >
                <el-input v-model="item.value" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click.native="addFormVisible = false">取消</el-button>
              <el-button type="primary" @click.native="addSubmit(addForm)" :loading="editLoading">提交</el-button>
            </div>
          </el-dialog>

          <!--编辑界面-->
          <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form label-width="90px" ref="editForm">
              <el-form-item
                v-for="(item,i) in editForm"
                :key="i"
                :label="item.label.substring(0,8)+':'"
                :prop="item.prop"
              >
                <el-input auto-complete="off" v-model="item.value"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click.native="editFormVisible = false">取消</el-button>
              <el-button
                type="primary"
                @click.native="editSubmit(editForm)"
                :loading="editLoading"
              >提交</el-button>
            </div>
          </el-dialog>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "axios"; //全局注册，使用方法为:this.$axios
import { constants } from "fs";
import { fail } from "assert";
export default {
  name: "Home",
  data() {
    return {
      Dataloading: true,
      serverURL: "http://192.168.65.62:8081/dbcz/",
      appId: "zdr",
      tableName: "key_keyword",
      compId: "",
      //筛选
      Keyword: "", //关键词
      importType: "", //重点类型
      importTypeList: [
        //重点类型下拉数据
        {
          id: 1,
          name: "全部类型"
        },
        {
          id: 2,
          name: "国宝类"
        },
        {
          id: 3,
          name: "基督教"
        },
        {
          id: 4,
          name: "藏传佛教"
        },
        {
          id: 5,
          name: "伊斯兰教"
        },
        {
          id: 6,
          name: "其他宗教"
        },
        {
          id: 7,
          name: "法轮功"
        },
        {
          id: 8,
          name: "其他邪教"
        },
        {
          id: 9,
          name: "有害功法"
        },
        {
          id: 10,
          name: "宗教极端"
        },
        {
          id: 11,
          name: "涉疆"
        },
        {
          id: 12,
          name: "涉藏"
        },
        {
          id: 13,
          name: "刑事犯罪类"
        },
        {
          id: 14,
          name: "涉蒙"
        },
        {
          id: 15,
          name: "半岛渗透"
        },
        {
          id: 16,
          name: "名族分裂"
        },
        {
          id: 17,
          name: "自由化思潮"
        },
        {
          id: 18,
          name: "左帮右派"
        },
        {
          id: 19,
          name: "民运"
        },
        {
          id: 20,
          name: "非法组织"
        },
        {
          id: 21,
          name: "西方反华势力"
        }
      ],
      searchParam: [],
      Source: "", //来源
      sourceList: [
        //来源 下拉数据
        {
          id: 0,
          name: "0"
        },
        {
          id: 1,
          name: "1"
        }
      ],
      Editor: "", //编辑人
      pickerOptions: {
        //日期时间选择器
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      CreationTime: "", //创建日期时间
      NewEditTime: "", //最新编辑日期时间
      currentPage: 1, //第几页
      // 表格内容
      tableData: [],
      tableDataNum: 0,
      pageParam: {
        pageNo: 1,
        pageSize: 10
      },
      tableHeader: [], //表格头部
      addFormVisible: false, //添加弹窗是否显示
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      addForm: [], //添加
      editForm: [], //编辑

      //默认数据
      headerList: [
        {
          label: "主键",
          prop: "id",
          type: "VARCHAR",
          value: ""
        },
        {
          label: "关键词",
          prop: "key_word",
          type: "VARCHAR",
          value: ""
        },
        {
          label: "重点类型",
          prop: "key_type_id",
          type: "VARCHAR",
          value: ""
        },
        {
          label: "创建时间",
          prop: "create_time",
          type: "DATETIME",
          value: ""
        },
        {
          label: "创建人ID",
          prop: "creator_id",
          type: "VARCHAR",
          value: ""
        },
        {
          label: "创建人姓名",
          prop: "creator_name",
          type: "VARCHAR",
          value: ""
        },
        {
          label: "修改时间",
          prop: "edit_time",
          type: "DATETIME",
          value: ""
        },
        {
          label: "修改人ID",
          prop: "editor_id",
          type: "VARCHAR",
          value: ""
        },
        {
          label: "修改人姓名",
          prop: "editor_name",
          type: "VARCHAR",
          value: ""
        },
        {
          label: "来源；0：录入，1：系统同步",
          prop: "source",
          type: "INT",
          value: ""
        }
      ],
      //表格默认数据
      tableList: {
        data: [
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "5970ec8342154768810672685e12c81d",
            key_type_id: "11",
            key_word: "测试9",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "63ec6f66f1d4490a867dcdea8dd698b0",
            key_type_id: "11",
            key_word: "测试6",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "6a2d2345ad174f43bc37992700caee16",
            key_type_id: "11",
            key_word: "测试2",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "79572bb1f934474d8626678209b78b7e",
            key_type_id: "11",
            key_word: "测试4",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T05:33:23.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "7b151f1d553144698b4ffc3cb2373672",
            key_type_id: "11",
            key_word: "测试10",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "94531bb5806d4723867a43af114c3b85",
            key_type_id: "11",
            key_word: "测试8",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:43.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "d80aa59ce6924238a62b2263acf692c4",
            key_type_id: "11",
            key_word: "string",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:43.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "d85275bef926435db4cd386622a32a57",
            key_type_id: "11",
            key_word: "测试3",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "5970ec8342154768810672685e12c81d",
            key_type_id: "11",
            key_word: "测试9",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "63ec6f66f1d4490a867dcdea8dd698b0",
            key_type_id: "11",
            key_word: "测试6",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "6a2d2345ad174f43bc37992700caee16",
            key_type_id: "11",
            key_word: "测试2",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "79572bb1f934474d8626678209b78b7e",
            key_type_id: "11",
            key_word: "测试4",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T05:33:23.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "7b151f1d553144698b4ffc3cb2373672",
            key_type_id: "11",
            key_word: "测试10",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "94531bb5806d4723867a43af114c3b85",
            key_type_id: "11",
            key_word: "测试8",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:43.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "d80aa59ce6924238a62b2263acf692c4",
            key_type_id: "11",
            key_word: "string",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:43.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "d85275bef926435db4cd386622a32a57",
            key_type_id: "11",
            key_word: "测试3",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "5970ec8342154768810672685e12c81d",
            key_type_id: "11",
            key_word: "测试9",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "63ec6f66f1d4490a867dcdea8dd698b0",
            key_type_id: "11",
            key_word: "测试6",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "6a2d2345ad174f43bc37992700caee16",
            key_type_id: "11",
            key_word: "测试2",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "79572bb1f934474d8626678209b78b7e",
            key_type_id: "11",
            key_word: "测试4",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T05:33:23.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "7b151f1d553144698b4ffc3cb2373672",
            key_type_id: "11",
            key_word: "测试10",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:42.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "94531bb5806d4723867a43af114c3b85",
            key_type_id: "11",
            key_word: "测试8",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:43.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "d80aa59ce6924238a62b2263acf692c4",
            key_type_id: "11",
            key_word: "string",
            source: "录入"
          },
          {
            create_time: "2019-07-05T05:33:23.000+0000",
            creator_id: "string",
            creator_name: "string",
            edit_time: "2019-07-05T21:39:43.000+0000",
            editor_id: "string",
            editor_name: "string",
            id: "d85275bef926435db4cd386622a32a57",
            key_type_id: "11",
            key_word: "测试3",
            source: "录入"
          }
        ],
        total: 8
      }
    };
  },
  mounted() {
    this.getTableSearch(); //页面加载时获取表格结构
    this.getTableContent(); //页面加载时获取表格数据
  },
  methods: {
    //页面加载时获取表格结构
    getTableSearch() {
      var self = this;
      axios
        .post(
          this.serverURL + "singletable/getTableSearch",
          this.qs.stringify({
            appId: this.appId,
            compId: this.compId,
            tableName: this.tableName
          })
        )
        .then(function(response) {
          //console.log(response.data);
          self.tableHeader = response.data;
          self.searchParam = response.data;
        })
        .catch(function(error) {
          console.log(error);
          // self.tableHeader = self.headerList;
          // self.searchParam = self.headerList;
        });
    },

    //页面加载时获取表格数据
    getTableContent() {
      var self = this;
      axios
        .post(
          this.serverURL + "singletable/tablePageSelect",
          {
            compId: this.compId,
            dataBaseName: this.appId,
            tableName: this.tableName,           
            criteria: this.searchParam,           
            currentPage: this.pageParam.pageNo,                       
            pageSize: this.pageParam.pageSize,                      
          }
        )
        .then(function(response) {
          console.log(response);
          for (var i = 0; i < response.data.data.length; i++) {
            var time1 = formatDateTime(response.data.data[i].create_time);
            var time2 = formatDateTime(response.data.data[i].edit_time);
            //  时间转换
            function addZero(num) {
              return num < 10 ? "0" + num : num;
            }
            function formatDateTime(date) {
              var time = new Date(Date.parse(date));
              time.setTime(time.setHours(time.getHours() + 8));
              var Y = time.getFullYear() + "-";
              var M = addZero(time.getMonth() + 1) + "-";
              var D = addZero(time.getDate()) + " ";
              var h = addZero(time.getHours()) + ":";
              var m = addZero(time.getMinutes()) + ":";
              var s = addZero(time.getSeconds());
              return Y + M + D + h + m + s; // }
            }
            response.data.data[i].create_time = time1;
            response.data.data[i].edit_time = time2;
            if (
              response.data.data[i].create_time == "NaN-NaN-NaN NaN:NaN:NaN"
            ) {
              response.data.data[i].create_time = "";
            }
            if (response.data.data[i].edit_time == "NaN-NaN-NaN NaN:NaN:NaN") {
              response.data.data[i].edit_time = "";
            }
          }
          self.tableData = response.data.data;
          self.tableDataNum = response.data.total;
          self.Dataloading = false;
        })
        .catch(function(error) {
          console.log(error);
          // self.tableData = self.tableList.data;
          // self.tableDataNum = self.tableList.total;
          // self.Dataloading = false;
        });
    },

    //筛选
    handlesearch(searchParam) {
      var self = this;
      self.getTableContent();
      for (let item of searchParam) {
        if (item.value == null || item.value == undefined) {
          console.log(item.value);
          self.$message({
            message: "输入不合法",
            type: "warning"
          });
          return false;
        } else {
          self.getTableContent();
        }
      }
    },

    //清除
    handleclean(searchParam) {
      var self = this;
      for (let item of searchParam) {
        item.value = "";
      }
      self.getTableContent();
    },

    //分页 每页条数
    handleSizeChange(val) {
      alert(1)
      this.pageParam.pageSize = val;
      this.getTableContent();
    },
    //点击的页数
    handleCurrentChange(val) {
      this.pageParam.pageNo = val;
      this.getTableContent();
    },

    //新建  弹窗
    handladd() {
      this.addForm = this.tableHeader;
      this.addFormVisible = true;
    },
    // 新建提交
    addSubmit(row) {
      var self = this;
      axios
        .post(this.serverURL + "singletable/tableIncrease", {
          dataBaseName: "zdr",
          fieldAndValues: [
            {
              fieldName: row[0].prop,
              value: row[0].value,
              type: row[0].type
            },
            {
              fieldName: row[1].prop,
              value: row[1].value,
              type: row[1].type
            },
            {
              fieldName: row[2].prop,
              value: row[2].value,
              type: row[2].type
            },
            {
              fieldName: row[3].prop,
              value: row[3].value,
              type: row[3].type
            },
            {
              fieldName: row[4].prop,
              value: row[4].value,
              type: row[4].type
            },
            {
              fieldName: row[5].prop,
              value: row[5].value,
              type: row[5].type
            },
            {
              fieldName: row[6].prop,
              value: row[6].value,
              type: row[6].type
            },
            {
              fieldName: row[7].prop,
              value: row[7].value,
              type: row[7].type
            },
            {
              fieldName: row[8].prop,
              value: row[8].value,
              type: row[8].type
            },
            {
              fieldName: row[9].prop,
              value: row[9].value,
              type: row[9].type
            }
          ],
          tableName: this.tableName
        })
        .then(res => {
          self.$message({
            type: "success",
            message: "新建成功!"
          });
          this.addFormVisible = false;
          self.getTableContent();
        });
    },
    //编辑 弹窗
    handleClickedit(row) {
      // console.log(row);

      this.editForm = this.tableHeader;
      var a = [];
      for (let i in row) {
        a.push(row[i]);
      }
      for (let i in a) {
        console.log(a[i]);
        for (let i in this.editForm) {
          // console.log(a[i]);
          this.editForm[i].value = a[i];
          // console.log(this.editForm[i].value);
        }
      }
      console.log(this.tableData);

      this.editFormVisible = true;
    },

    //编辑后提交
    editSubmit() {},

    //删除
    handleClickdel(row) {
      // console.log(row);

      var self = this;
      this.$confirm(" 是否删除该文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .post(this.serverURL + "singletable/tableDelete2", {
              // appId: this.appId,
              // compId: this.compId,
              // tableName: this.tableName,
              // rowId: row.id
              // compId: this.compId,
              dataBaseName: this.appId,
              id: row.id,
              tableName: this.tableName
            })
            .then(function(response) {
              //console.log(response);
              self.$message({
                type: "success",
                message: "删除成功!"
              });
              self.getTableContent();
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>
* {
  font-size: 12px;
  font-family: "微软雅黑";
}
[v-cloak] {
  display: none !important;
}
.handle-box {
  margin-bottom: 10px;
  overflow: hidden;
}
.handle-box .el-col {
  margin-bottom: 10px;
}
.el-col-22 {
  width: 87%;
}
.el-col-2 {
  width: 13%;
}
.handle-box span {
  font-size: 12px;
  padding-right: 5px;
  color: #999;
}
.handle-select {
  width: 150px;
}
.handle-input {
  width: 150px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.search-box {
  padding: 10px 0;
  text-align: right;
  border-left: 1px solid #666;
}
.search-box-btn a:first-child {
  display: inline-block;
  width: 81px;
  height: 26px;
  line-height: 26px;
  margin-left: 14px;
  margin-right: 5px;
  padding: 3px 2px;
  text-align: center;
  text-decoration: none;
  background: url("../assets/images/filterbtn.png") no-repeat;
  color: #fff;
  overflow: hidden;
}
.search-box-btn a:first-child em {
  display: inline-block;
  width: 15px;
  height: 26px;
  margin-left: 14px;
  margin-right: -10px;
  float: left;
  background: url("../assets/images/filtericon.png") no-repeat center;
  overflow: hidden;
}
.search-box-btn a:last-child {
  overflow: hidden;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  color: #999;
  text-decoration: underline;
  font-weight: normal;
}
.searchlist {
  float: left;
  margin: 0 40px 10px 0;
}
.tip-len-btn {
  margin: 0 0 2px 0;
  padding: 0 10px;
  overflow: hidden;
  background: #2f3030;
  border-radius: 10px;
  color: #fff;
  overflow: hidden;
}
.tip-len-btn b {
  position: relative;
  top: 6px;
}
.tip-len-btn span {
  color: #f58c22;
}
.tip-len-btn a {
  display: inline-block;
  width: 81px;
  height: 26px;
  line-height: 26px;
  margin-left: 14px;
  margin-right: 5px;
  padding: 3px 2px;
  text-align: center;
  text-decoration: none;
  float: right;
  background: url("../assets/images/filterbtn.png") no-repeat;
  color: #fff;
}
.tip-len-btn a em {
  display: inline-block;
  width: 15px;
  height: 26px;
  margin-left: 14px;
  margin-right: -10px;
  float: left;
  background: url("../assets/images/addicon.png") no-repeat center;
}
.home .el-table__body button {
  border-radius: 15px;
}
.home .has-gutter {
  border-radius: 10px;
}
.home .el-table thead th {
  background: #3d5c99;
  color: #fff;
}
.home .el-input__inner {
  border-radius: 10px;
}
.home .el-pagination {
  float: right;
  overflow: hidden;
}
.home .el-pagination .el-select .el-input .el-input__inner {
  border-radius: 10px;
}
.home .el-table .cell {
  line-height: 36px;
}
.home .el-table .el-table--mini td,
.home .el-table--mini td,
.el-table--mini th {
  padding: 0;
}
.home .el-input--mini .el-input__inner {
  height: 20px;
  line-height: 20px;
  border: 1px solid #666;
}
.home .el-range-editor--mini.el-input__inner {
  height: 20px;
  padding: 0 10px;
  border: 1px solid #666;
}
.home .el-button:focus,
.home .el-button:hover {
  background: url("../assets/images/filterbtn.png") no-repeat;
  color: #fff;
}
.scope-con {
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
}
.home-right {
  text-align: right;
}
.home-center {
  text-align: center;
}
/* .el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
  width: 90px;
}
.el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
  margin-left: 90px;
} */
</style>