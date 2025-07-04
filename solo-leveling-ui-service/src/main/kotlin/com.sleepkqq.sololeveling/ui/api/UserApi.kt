package com.sleepkqq.sololeveling.ui.api

import com.sleepkqq.sololeveling.proto.user.AuthUserRequest
import com.sleepkqq.sololeveling.proto.user.GetUserInfoRequest
import com.sleepkqq.sololeveling.proto.user.UserInfo
import com.sleepkqq.sololeveling.proto.user.UserServiceGrpc.UserServiceBlockingStub
import com.sleepkqq.sololeveling.ui.mapper.DtoMapper
import com.sleepkqq.sololeveling.ui.model.UserData
import org.springframework.stereotype.Service

// todo: add retry
@Service
class UserApi(
	private val userStub: UserServiceBlockingStub,
	private val dtoMapper: DtoMapper
) {

	fun getUserInfo(userId: Long): UserInfo = userStub.getUserInfo(
		GetUserInfoRequest.newBuilder()
			.setUserId(userId)
			.build()
	)
		.userInfo

	fun authUser(userData: UserData) = userStub.authUser(
		AuthUserRequest.newBuilder()
			.setUserInfo(dtoMapper.map(userData))
			.build()
	)
}

