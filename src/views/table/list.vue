<template>
  <div class="app-container">
    <div>
			<div  class="actions">
				<router-link :to="`/task/create`">
					<el-button size="small"
						type="primary">新建任务</el-button>
				</router-link>
      </div>
      <div  class="actions">
				<el-input size="small"
				    v-model="queryString"
				    placeholder="请输入搜索内容"
				    prefix-icon="el-icon-search"            
            width="200px"/> 
			</div>
      <el-button size="small"
						type="primary" @click="querySearchAsync(queryString)" >搜索</el-button>
		</div>
    <el-table
      v-loading="listLoading"
      :data="users"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row

    >
      <el-table-column label="ID" prop="id" align="center" width="120">
				<template slot-scope="scope">
          <router-link :to="`/task/view/${scope.row.id}`">
          <el-button 
          type="text" 
          size="small" 
          style="font-size:14px">{{scope.$index +1}}</el-button>
          </router-link>	
				</template>
			</el-table-column>
      <el-table-column label="Title" width="155" prop="title" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="performer" width="110" align="center" prop="performer">
        <template slot-scope="scope">
          <span>{{ scope.row.performer }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="begintime" label="开始日期" width="200" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.begintime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="endtime" label="截止日期" width="200" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.endtime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" class-name="status-col" label="完成状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state=='1' ?'success':'info'">{{scope.row.state|getStateName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          align="center"
          >
          <template slot-scope="scope">
            <router-link :to="`/task/edit/${scope.row.id}`">
              <el-button type="success" size="small" @click="setCurrent(row)">编辑</el-button>
            </router-link>
            <el-button type="danger" size="small" @click="removeUser(scope.$index+1, scope.row)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
    mapState,
    mapMutations,
    mapGetters,
    mapActions
} from 'vuex';
import api from "../../utils/auth"

export default {
  filter: {
      description: '',
      endtime: '',
      performer: '',
      state: '',
      title: '',
  },
  filters: {
    getStateName(state) {
      const stateMap= {
        0: '未完成',
        1: '已完成',
      };
      return stateMap[state]
    }
  },
  data() {
    return {
      users: [],
      row:null,
      queryString: null,
      listLoading: true
    }
  },
  // watch: {
  //   filterText(val) {
  //     this.$refs.users.filter(val)
  //   }
  // },
  mounted(){
    this.getUsers();
  },
  methods: {
    // 重置表单
    // reset() {
    //     this.$refs.users.resetFields();
    // },
    getUsers(){
        this.listLoading = true
        let self = this
        api._get().then(res => {
            self.users = res;
            console.log(res,8888);
            this.listLoading = false
        },err => {
            console.log(err);
        })
    },
    
    removeUser(index,row) {
      console.log(index, row);
      this.$confirm('是否要删除任务' + row.title + '  ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          this.handleDelete(index,row);
          this.$message({
            type: 'success',
            message: '成功删除了任务——' + row.title + ' !'
          });
        }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    handleDelete(index, row) {
      api._remove(row).then(res => {
        this.users.splice(index, 1);
        this.getUsers();
      });
    },

    querySearchAsync(queryString) {
        let self = this
        api._gets(queryString).then(res =>{
            console.log(res);
            self.users = res;
            console.log(self.users);
        }).catch((err)=>{
          console.log(err);
        })
    },
    // filterNode(value, data) {
    //   if (!value) 
    //     return true
    //   return data.title.indexOf(value) !== -1
    // },
  }
}
</script>

<style>
.actions{
    float: left;
    margin-right: 15px;
    margin-bottom: 15px;
}
</style>