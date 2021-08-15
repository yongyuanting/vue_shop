<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片视图-->
    <el-card>
      <!--      添加角色按钮区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisivle=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--      角色列表区域-->
      <el-table :data="roleList" border stripe>
        <!--        展开列-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"
                    :class="['bdbottom',i1 === 0?'bdtop':'','vcenter']">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--通过for循环嵌套渲染二级权限-->
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0?'':'bdtop','vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{
                        item2.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13">
                    <el-tag type="warning" v-for="(item3,) in item2.children" :key="item3.id" closable
                            @close="removeRightById(scope.row,item3.id)">{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--        索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <!--            <div>{{scope.row}}</div>-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--    添加角色对话框-->
    <el-dialog
      title="添加用户"
      v-model="addDialogVisivle"
      width="50%"
      @close="addDialogClosed">
      <!--      内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="用户描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <!--      对话框底部区域-->
        <span class="dialog-footer">
          <el-button @click="addDialogVisivle=false">取消</el-button>
          <el-button type="primary" @click="addRole">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--    修改角色的对话框-->
    <el-dialog
      title="修改角色"
      v-model="editDialogVisible"
      width="50%">
      <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="70px">
        <el-form-item label="角色id">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="editDialogVisible = false" @close="editDialogClosed">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--分配权限的对话框-->
    <el-dialog
      title="分配权限"
      v-model="setRightdialogVisible"
      width="50%"
      @close="setRightDialogClose">
      <!--      树形控件-->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all=true
               :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="setRightdialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="allotRights">确 定</el-button>
    </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Role',
  data () {
    return {
      // 所有角色的列表数据
      roleList: [],
      addDialogVisivle: false,
      editDialogVisible: false,
      setRightdialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {},
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 当前即将分配权限的角色ID
      roleId: '',
      // 默认选中的节点id值数组
      defKeys: [],
      addFormRules: {
        roleName: [{
          required: true,
          message: '请输入角色名',
          trigger: 'blur'
        }, {
          min: 3,
          max: 10,
          message: '角色名长度在 3 到 10 个字符',
          trigger: 'blur'
        }],
        roleDesc: [{
          message: '请输入描述(可不填写)',
          trigger: 'blur'
        }, {
          min: 1,
          max: 10,
          message: '描述长度在 1 到 10 个字符',
          trigger: 'blur'
        }]
      },
      editFormrules: {
        roleName: [{
          required: true,
          message: '请输入角色名',
          trigger: 'blur'
        }, {
          min: 3,
          max: 10,
          message: '角色名长度在 3 到 10 个字符',
          trigger: 'blur'
        }],
        roleDesc: [{
          message: '请输入描述(可不填写)',
          trigger: 'blur'
        }, {
          min: 1,
          max: 10,
          message: '描述长度在 1 到 10 个字符',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有的角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addRole () {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (valid === true) {
          const { data: res } = await this.$http.post('roles', this.addForm)
          console.log(res)
          if (res.meta.status !== 201) {
            this.$message.error('添加角色失败')
          }
          this.$message.success('添加角色成功')
          // 隐藏对话框
          this.addDialogVisivle = false
          this.getRolesList()
        }
      })
    },
    // 展示编辑用户对话框
    async showEditDialog (id) {
      // console.log(id)
      // 根据id查询数据并放到editForm中
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败')
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return 0
        // 发起修改角色信息的数据请求
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        // console.log(typeof this.editForm.roleId)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败')
        }
        this.editDialogVisible = false
        this.getRolesList()
        this.$message.success('角色信息更新成功')
      })
    },
    async deleteById (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作会删除选中用户，是否继续？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getRolesList()
    },
    // 根据id删除对应权限
    async removeRightById (roles, rightId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm('此操作会删除选中用户，是否继续？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // console.log('确认了删除')
      const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // this.getRolesList()
      roles.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.rightsList = res.data
      // console.log(this.rightsList)
      // 传入角色，进行递归
      this.getLeafKeys(role, this.defKeys)
      this.setRightdialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id保存到defKeys数组中
    getLeafKeys (role, arr) {
      if (!role.children) {
        // 如果当前node节点不包含children属性，就是三级节点
        return arr.push(role.id)
      }
      // 不是三级节点
      role.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClose () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        // 获取半选或全选的ID
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      // 使用，分割
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightdialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
