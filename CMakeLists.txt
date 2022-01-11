cmake_minimum_required(VERSION 3.21)
project(CSC_490_project)

add_executable(ShaderView src/main.cpp src/rendering_engine.cpp src/rendering_engine.h)
set(CMAKE_CXX_STANDARD 17)

SET(CMAKE_CXX_FLAGS ${CMAKE_CXX_FLAGS} "-pthread")

find_package(OpenGL REQUIRED)
target_link_libraries(ShaderView OpenGL::GL)
target_include_directories(ShaderView PUBLIC ${OPENGL_INCLUDE_DIRS})

find_package(SDL2 REQUIRED)
target_link_libraries(ShaderView ${SDL2_LIBRARIES})
target_include_directories(ShaderView PUBLIC ${SDL2_INCLUDE_DIRS})

target_include_directories(ShaderView PUBLIC lib/glm/glm lib/spdlog/include)
